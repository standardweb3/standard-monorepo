'use client';
import { PonderLinks } from '../../enums';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import fetchNewListingPairs from '../../queries/Pairs/NewListing';
import type { Pair } from '../../queries/Pairs/AllPairs';

export const useNewListingPairsPaginated = (network: string, limit: number, page: number) => {
  const apiUrl: string = PonderLinks[network];
  const queryKey = [`allPairs-new-${network}`];
  const queryClient = useQueryClient();

  const fetchTokens = async () => {
    try {
      const pairs: Pair[] = await fetchNewListingPairs(apiUrl, limit, page);
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
