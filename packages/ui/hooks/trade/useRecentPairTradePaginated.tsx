'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchRecentPairTradesPaginated } from 'queries';
import { PonderLinks, PonderWssLinks } from 'enums';
import { io } from 'socket.io-client';
import type { Token, TradesData, UpdateTradeEvent } from 'types';

export const useRecentPairTradePaginated = (
  networkName: string,
  base: Token,
  quote: Token,
  pageSize: number,
) => {
  const apiUrl = useMemo(() => PonderLinks[networkName], [networkName]);
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);

  const queryKey = useMemo(
    () => [`recent-trade-${base.id}-${quote.id}`],
    [base.id, quote.id],
  );

  const [localData, setLocalData] = useState<TradesData>({
    trades: [],
    totalCount: 0,
    totalPages: 0,
    pageSize: 0,
    lastUpdated: Date.now(),
  });

  const fetchWithPage = useCallback(async () => {
    const data = await fetchRecentPairTradesPaginated(
      apiUrl,
      base.id,
      quote.id,
      pageSize,
      page,
    );
    setLocalData(data);
    return data;
  }, [base, quote, page, apiUrl, pageSize]);

  const { data, error, status, refetch } = useQuery({
    queryKey,
    queryFn: fetchWithPage,
    enabled: !!base.id && !!quote.id,
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
        base,
        quote,
      };
      if (index > -1) {
        data.trades[index] = addition;
      } else {
        if (
          addition.base.id === update.base &&
          addition.quote.id === update.quote
        ) {
          data.trades.push(addition);
          data.trades.sort((a, b) => b.timestamp - a.timestamp);
        }
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
  }, [networkName, base, quote, queryClient, queryKey]);

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
