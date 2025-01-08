'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserAccountOrdersPaginatedWithLimit } from '../../queries';
import { PonderLinks, PonderWssLinks } from '../../enums';
import { useState, useEffect, useMemo } from 'react';
import io from 'socket.io-client';
import type {
  AccountOrders,
  Order,
} from '../../queries/Orders/UserAccountOrdersPaginatedWithLimit';
import type { Token } from 'queries/Tokens/AllTokens';

export type DeleteOrderEvent = {
  id: string;
  timestamp: number;
};

export type OrderEvent = {
  /// a unique identifier
  id: string;
  /// order type (bid(buy) if 1, ask(sell) if 0)
  isBid: number;
  /// placed order id
  orderId: number;
  /// base token address
  base: string;
  /// quote token address
  quote: string;
  /// orderbook contract address
  orderbook: string;
  /// price in 8 decimals
  price: number;
  /// deposit asset amount
  amount: number;
  /// placed asset amount
  placed: number;
  /// submitted timestamp
  timestamp: number;
  /// wallet address who made an order
  account: string;
  /// transaction hash
  txHash: string;
};

export const useAccountOrdersPaginated = (
  networkName: string,
  tokenlist: Token[] | undefined,
  address: string,
  pageSize: number,
) => {
  // GraphQL setup
  const apiUrl: string = PonderLinks[networkName];
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const queryKey = useMemo(() => [`${address}-orders`, page], [address, page]);

  const fetchWithPage = async (address: string, page: number) => {
    const data = await fetchUserAccountOrdersPaginatedWithLimit(
      address,
      apiUrl,
      page,
      pageSize,
    );
    return data ?? {
      orders: [],
      totalCount: 0,
      totalPages: 0,
      pageSize: 0,
    };
  };

  const { error, status, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchWithPage(address, page),
    placeholderData: (previousData, _previousQuery) => previousData,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const previousData = queryClient.getQueryData(queryKey);

  useEffect(() => {
    // setup websocket to listen to future events
    const SOCKET_SERVER_URL = `${PonderWssLinks[networkName]}`;

    const handleAdditionalOrder = (data: AccountOrders, update: OrderEvent) => {
      const updatedData: AccountOrders =
        data === undefined
          ? {
              orders: [],
              totalPages: 0,
              totalCount: 0,
              pageSize,
              lastUpdated: Date.now(),
            }
          : data;
      const tokens: Token[] =
        (queryClient.getQueryData([`allTokens-${networkName}`]) as Token[]) ??
        tokenlist;
      if (update.account === address) {
        const base = tokens.find((token: Token) => {
          return token.id.toLowerCase() === update?.base.toLowerCase();
        }) as Token;
        const quote = tokens.find((token: Token) => {
          return token.id.toLowerCase() === update?.quote.toLowerCase();
        }) as Token;
        const addition: Order = {
          ...update,
          base,
          quote,
          pair: `${base.symbol.toUpperCase()}/${quote.symbol.toUpperCase()}`,
        };
        const index = updatedData.orders.findIndex(
          (item: Order) => item.id === addition.id,
        );
        if (index > -1) {
          updatedData.orders[index] = addition;
        } else {
          updatedData.orders.push(addition);
          updatedData.totalCount += 1;
          updatedData.totalPages = Math.ceil(
            updatedData.totalCount / updatedData.pageSize,
          );
        }
      }

      return data;
    };

    const handleDeleteOrders = (
      data: AccountOrders,
      deletion: DeleteOrderEvent,
    ) => {
      const index = data.orders.findIndex(
        (item: Order) => item.id === deletion.id,
      );
      if (index > -1) {
        data.orders.splice(index, 1);
        data.totalCount -= 1;
        data.totalPages = Math.ceil(data.totalCount / data.pageSize);
      }
      return data;
    };

    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
    });

    socket.on('deleteOrder', (order: DeleteOrderEvent) => {
      let orderData: AccountOrders = queryClient.getQueryData(
        queryKey,
      ) as AccountOrders;
      // find the day in the array and replace it
      orderData = handleDeleteOrders(orderData, order);
      orderData.lastUpdated = Date.now();
      queryClient.setQueryData(queryKey, orderData);
    });

    socket.on('order', (order: OrderEvent) => {
      let orderData: AccountOrders = queryClient.getQueryData(
        queryKey,
      ) as AccountOrders;
      // find the day in the array and replace it
      orderData = handleAdditionalOrder(orderData, order);
      orderData.lastUpdated = Date.now();
      queryClient.setQueryData(queryKey, orderData);
    });

    return () => {
      socket.disconnect();
    };
  }, [address, networkName, queryClient, queryKey, pageSize, tokenlist]);

  const result: AccountOrders | undefined = queryClient.getQueryData(queryKey);

  if (status === 'pending' || status === 'error') {
    return {
      page,
      setPage,
      totalPages: previousData ? (previousData as AccountOrders).totalPages : 0,
      totalCount: previousData ? (previousData as AccountOrders).totalCount : 0,
      pageSize,
      data: previousData ? (previousData as AccountOrders).orders : [],
      prevData: previousData,
      error,
      status,
      queryKey,
    };
  }
  return {
    page,
    setPage,
    totalPages: result?.totalPages ?? 0,
    totalCount: result?.totalCount ?? 0,
    pageSize,
    data: result?.orders ?? [],
    prevData: previousData,
    error,
    status,
    queryKey,
    refetch,
    lastUpdated: result?.lastUpdated ?? 0,
  };
};
