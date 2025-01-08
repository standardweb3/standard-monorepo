"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchRecentTradesPaginated } from "@/queries";
import { GraphQLClient } from "graphql-request";
import { PonderLinks, PonderWssLinks } from "@/enums";
import { io } from "socket.io-client";

interface RecentTradeItem {
  baseAmount: number;
  quoteAmount: number;
  base: any;
  id: string;
  isBid: boolean;
  maker: string;
  price: number;
  quote: any;
  taker: string;
  timestamp: number;
  txHash: string;
}

interface RecentTradeDataPaginated {
  trades: RecentTradeItem[];
  lastUpdated: number;
}

export const useRecentPairTradePaginated = (
  networkName: string,
  base: { address: string },
  quote: { address: string }
) => {
  const apiUrl: string = PonderLinks[networkName];
  const client = useMemo(() => new GraphQLClient(apiUrl), [apiUrl]);
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => 
    [`recent-trade-${base.address}-${quote.address}`], 
    [base.address, quote.address]
  );

  const [localData, setLocalData] = useState<RecentTradeDataPaginated>({ trades: [], lastUpdated: 0 });

  const fetchWithCursor = useCallback(async () => {
    const data = await fetchRecentTradesPaginated(base, quote, client);
    setLocalData(data);
    return data;
  }, [base, quote, client]);

  const { data, error, status, refetch } = useQuery({
    queryKey,
    queryFn: fetchWithCursor,
    enabled: !!base.address && !!quote.address,
  });

  useEffect(() => {
    const SOCKET_SERVER_URL = `${PonderWssLinks[networkName]}`;

    const handleAdditionalData = (data: RecentTradeDataPaginated, addition: RecentTradeItem) => {
      const index = data.trades.findIndex(item => item.id === addition.id);
      if (index > -1) {
        data.trades[index] = addition;
      } else if (addition.base === base.address && addition.quote === quote.address) {
        data.trades.push(addition);
        data.trades.sort((a, b) => b.timestamp - a.timestamp);
      }
      return data;
    };

    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket']
    });

    socket.on("trade", (trade) => {
      setLocalData(prevData => {
        const updated = handleAdditionalData({ ...prevData }, trade);
        updated.lastUpdated = Date.now();
        queryClient.setQueryData(queryKey, updated);
        return updated;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [networkName, base.address, quote.address, queryClient, queryKey]);

  useEffect(() => {
    // Refetch data when base or quote address changes
    refetch();
  }, [base.address, quote.address, refetch]);

  return {
    data: localData.trades,
    error,
    status,
    queryKey,
    refetch,
  };
};