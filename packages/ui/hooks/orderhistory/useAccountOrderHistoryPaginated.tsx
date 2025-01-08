// @ts-nocheck
'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import { PonderLinks } from '@/enums';
import { useState } from 'react';
import fetchUserAccountOrderHistoryPaginatedWithLimit from '@/queries/Orders/UserAccountOrderHistoryPaginatedWithLimit';
import type { Token } from 'queries/Tokens/AllTokens';
import type { Order } from 'queries/Orders/UserAccountOrderHistoryPaginatedWithLimit';
import type { AccountOrderHistory } from 'queries/OrderHistory/UserAccountOrderHistoryPaginatedWithLimit';

export const useAccountOrderHistoryPaginated = (
  networkName: string,
  tokenlist: Token[],
  address: string,
  pageSize: number,
) => {
  // GraphQL setup
  const apiUrl: string = PonderLinks[networkName];
  const client = new GraphQLClient(apiUrl);

  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  const queryKey = [`${address}-orderHistory`, page];

  const fetchWithPage = async (
    address: string,
    page: number,
    client: GraphQLClient,
  ) => {
    const tokens: Token[] = queryClient.getQueryData([
      `allTokens-${networkName}`,
    ]) ?? tokenlist;
    const data: AccountOrderHistory = await fetchUserAccountOrderHistoryPaginatedWithLimit(
      address,
      tokens,
      page,
      pageSize,
    );
    return data ?? {
      orderHistory: [],
      totalCount: 0,
      totalPages: 0,
      pageSize: 0,
      lastUpdated: 0,
    };
  };

  const { data, error, status, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchWithPage(address, page, client),
    placeholderData: (previousData, _previousQuery) => previousData,
  });

  const previousData = queryClient.getQueryData(queryKey);

  if (status === 'pending' || status === 'error') {
    return {
      page,
      setPage,
      totalPages: previousData
        ? (previousData as UserAccountOrderHistory).totalPages
        : 0,
      totalOrderHistory: previousData
        ? (previousData as UserAccountOrderHistory).totalOrderHistory
        : 0,
      pageSize,
      data: previousData
        ? (previousData as UserAccountOrderHistory).orderHistory
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
    totalPages: data?.totalPages ?? 0,
    totalOrderHistory: data?.totalOrderHistory ?? 0,
    pageSize,
    data: data?.orderHistory ?? [],
    prevData: previousData,
    error,
    status,
    queryKey,
    refetch,
  };
};
