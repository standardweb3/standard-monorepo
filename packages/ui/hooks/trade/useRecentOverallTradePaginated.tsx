'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchRecentOverallTradesPaginated } from 'queries';
import { PonderLinks, PonderWssLinks } from 'enums';
import { io } from 'socket.io-client';
import type { Token, TradesData } from 'types';

export type UpdateTradeEvent = {
  id: string;
  orderId: number;
  base: string;
  quote: string;
  pair: string;
  isBid: number;
  price: number;
  orderbook: string;
  baseAmount: number;
  quoteAmount: number;
  timestamp: number;
  taker: string;
  maker: string;
  txHash: string;
};

export const useRecentOverallTradePaginated = (
  networkName: string,
  tokenlist: Token[],
  pageSize: number,
) => {
  const apiUrl = useMemo(() => PonderLinks[networkName], [networkName]);
  const queryClient = useQueryClient();
  const tokens =
    queryClient.getQueryData<Token[]>([`allTokens-${networkName}`]) ??
    tokenlist;

  const [page, setPage] = useState<number>(1);

  const queryKey = useMemo(
    () => [`recent-overall-trade-${networkName}`],
    [networkName],
  );

  const [localData, setLocalData] = useState<TradesData>({
    trades: [],
    totalCount: 0,
    totalPages: 0,
    pageSize: 0,
    lastUpdated: Date.now(),
  });

  const fetchWithPage = useCallback(
    async (page: number) => {
      const data: TradesData = await fetchRecentOverallTradesPaginated(
        apiUrl,
        pageSize,
        page,
      );
      setLocalData(data);
      return data;
    },
    [apiUrl, pageSize],
  );

  const { data, error, status, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchWithPage(page),
  });

  useEffect(() => {
    const SOCKET_SERVER_URL = `${PonderWssLinks[networkName]}`;

    const handleAdditionalData = (
      data: TradesData,
      update: UpdateTradeEvent,
    ) => {
      const index = data.trades.findIndex(item => item.id === update.id);
      const addition = {
        ...update,
        base: tokens.find((token: Token) => token.id === update.base) as Token,
        quote: tokens.find(
          (token: Token) => token.id === update.quote,
        ) as Token,
      };
      if (index > -1) {
        data.trades[index] = addition;
      } else {
        data.trades.push(addition);
        data.trades.sort((a, b) => b.timestamp - a.timestamp);
      }
      return data;
    };

    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    socket.on('trade', trade => {
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
  }, [networkName, queryClient, queryKey, tokens]);

  return {
    page,
    setPage,
    totalPages: localData.totalPages,
    totalTrades: localData.totalCount,
    pageSize,
    data: localData.trades,
    error,
    status,
    queryKey,
    refetch,
  };
};
