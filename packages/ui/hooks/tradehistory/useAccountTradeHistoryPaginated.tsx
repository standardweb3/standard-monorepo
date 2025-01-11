'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PonderLinks, PonderWssLinks } from 'enums';
import { useState, useEffect, useMemo } from 'react';
import { fetchUserAccountTradeHistoryPaginatedWithLimit } from 'queries';
import type {
  TradeHistory,
  AccountTradeHistory,
  UpdateTradeHistoryEvent,
} from 'types';
import io from 'socket.io-client';
import type { Token } from 'types';

export const useAccountTradeHistoryPaginated = (
  networkName: string,
  tokenlist: Token[],
  address: string,
  pageSize: number,
) => {
  // GraphQL setup
  const apiUrl: string = PonderLinks[networkName];

  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => [`${address}-tradeHistory`, page],
    [address, page],
  );

  const [localData, setLocalData] = useState({
    tradeHistory: [],
    totalCount: 0,
    totalPages: 0,
    pageSize: 0,
    lastUpdated: Date.now(),
  } as AccountTradeHistory);

  const fetchWithPage = async (address: string, page: number) => {
    const tokens: Token[] =
      queryClient.getQueryData([`allTokens-${networkName}`]) ?? tokenlist;
    const data = await fetchUserAccountTradeHistoryPaginatedWithLimit(
      address,
      apiUrl,
      page,
      pageSize,
    );

    setLocalData(data);
    return data;
  };

  const { data, error, status, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchWithPage(address, page),
    placeholderData: () => ({
      tradeHistory: [],
      totalCount: 0,
      totalPages: 0,
      totalTradeHistory: 0,
      pageSize: 0,
      lastUpdated: Date.now(),
    }),
  });

  useEffect(() => {
    // setup websocket to listen to future events
    const SOCKET_SERVER_URL = `${PonderWssLinks[networkName]}`;

    const handleAdditionalData = (
      data: AccountTradeHistory,
      update: UpdateTradeHistoryEvent,
    ) => {
      const tokens: Token[] = tokenlist;
      const base = tokens?.find(
        (token: Token) => token.id === update.base,
      ) as Token;
      const quote = tokens?.find(
        (token: Token) => token.id === update.quote,
      ) as Token;
      const addition = {
        ...update,
        base,
        quote,
        pair: `${base?.symbol}/${quote?.symbol}`,
      };
      const index = data.tradeHistory?.findIndex(
        (tradeHistory: TradeHistory) => tradeHistory.id === addition.id,
      );
      if (index > -1) {
        data.tradeHistory[index] = addition;
      } else {
        if (addition.maker === address || addition.taker === address) {
          data.tradeHistory?.push(addition);
          data.totalCount += 1;
          data.totalPages = Math.ceil(data.totalCount / pageSize);
        }
      }
      return data;
    };

    const updateTradeHistory = (key: string, newData: UpdateTradeHistoryEvent) => {
      queryClient.setQueryData(queryKey, (oldData: AccountTradeHistory) => {
        const data = oldData || {
          tradeHistory: [],
          totalPages: 0,
          totalTradeHistory: 0,
          pageSize,
          lastUpdated: 0,
        };
        const updatedData = {
          ...handleAdditionalData(data, newData),
          lastUpdated: Date.now(),
        };
        return updatedData;
      });
      setLocalData((oldData: AccountTradeHistory) => {
        const data = oldData || {
          tradeHistory: [],
          totalPages: 0,
          totalTradeHistory: 0,
          pageSize,
          lastUpdated: 0,
        };
        const updatedData = {
          ...handleAdditionalData(data, newData),
          lastUpdated: Date.now(),
        };
        return updatedData;
      });
    };

    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    socket.on('tradeHistory', (tradeHistory: UpdateTradeHistoryEvent) => {
      const accountTradeHistory = localData;
      // find the day in the array and replace it
      updateTradeHistory('tradeHistory', tradeHistory);
    });

    return () => {
      socket.disconnect();
    };
  }, [
    address,
    networkName,
    queryKey,
    tokenlist,
    queryClient,
    localData,
    pageSize,
  ]);

  const previousData = queryClient.getQueryData(queryKey);

  if (status === 'pending' || status === 'error') {
    return {
      page,
      setPage,
      totalPages: previousData
        ? (previousData as AccountTradeHistory).totalPages
        : 0,
      totalTradeHistory: previousData
        ? (previousData as AccountTradeHistory).totalCount
        : 0,
      pageSize,
      data: previousData
        ? (previousData as AccountTradeHistory).tradeHistory
        : [],
      prevData: previousData,
      error,
      status,
      queryKey,
    };
  }
  return {
    page,
    setPage,
    totalPages: localData?.totalPages ?? 0,
    totalTradeHistory: localData?.totalCount ?? 0,
    pageSize,
    data: localData?.tradeHistory ?? [],
    prevData: previousData,
    error,
    status,
    queryKey,
    refetch,
  };
};
