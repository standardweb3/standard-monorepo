'use client';
import { PonderLinks } from '../../enums';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNewListingPairs } from 'queries';
import { useState } from 'react';
import type { PairData } from 'types';

export const useNewListingPairsPaginated = (network: string, pageSize: number) => {
  const apiUrl: string = PonderLinks[network];
  const queryKey = [`allPairs-new-${network}`];
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);

  const fetchWithPage = async (page: number) => {
    try {
      const pairs: PairData = await fetchNewListingPairs(apiUrl, pageSize, page);
      return pairs;
    } catch (error) {
      console.error('pair fetching error', error);
    }
  };

  const { data, status, error, isSuccess, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchWithPage(page),
  });

  const previousData = queryClient.getQueryData(queryKey);

  if (isSuccess && data) {
    return {
      page,
      setPage,
      totalPages: data?.totalPages ?? 0,
      totalPairs: data?.totalCount ?? 0,
      pageSize,
      data: data?.pairs ?? [],
      prevData: previousData,
      error,
      status,
      queryKey,
      refetch,
    };
  }

  return {
    page,
    setPage,
    totalPages: 0,
    totalPairs: 0,
    pageSize,
    data: [],
    prevData: previousData,
    error,
    status,
    queryKey,
    refetch,
  };
};
