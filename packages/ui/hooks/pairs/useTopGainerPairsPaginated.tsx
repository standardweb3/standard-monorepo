'use client';
import { PonderLinks } from '../../enums';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import fetchTopGainerPairs from '../../queries/Pairs/TopGainer';
import type { Pair } from '../../queries/Pairs/AllPairs';

export const useTopGainerPairsPaginated = (network: string, limit: number, page: number) => {
  const apiUrl: string = PonderLinks[network];
  const queryKey = [`allPairs-top-gainer-${network}`];
  const queryClient = useQueryClient();

  const fetchTokens = async () => {
    try {
      const pairs: Pair[] = await fetchTopGainerPairs(apiUrl, limit, page);
      return pairs;
    } catch (error) {
      console.error('pair fetching error', error);
    }
  };

  const { data, status, error, isSuccess } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchTokens(),
  });

  const previousData = queryClient.getQueryData(queryKey);

  if (isSuccess && data) {
    return {
      data: previousData ?? [],
      isSuccess,
      status,
      error,
      queryKey,
    };
  }

  return {
    data,
    isSuccess,
    status,
    error,
    queryKey,
  };
};
