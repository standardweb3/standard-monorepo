'use client';
import { PonderLinks } from '../../enums';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import fetchTopGainerTokens from '../../queries/Tokens/TopGainer';
import type { Token } from '../../queries/Tokens/AllTokens';

export const useTopGainerTokensPaginated = (network: string, limit: number, page: number) => {
  const apiUrl: string = PonderLinks[network];
  const queryKey = [`allTokens-top-gainer-${network}`];
  const queryClient = useQueryClient();

  const fetchTokens = async () => {
    try {
      const tokens: Token[] = await fetchTopGainerTokens(apiUrl, limit, page);
      return tokens;
    } catch (error) {
      console.error('token fetching error', error);
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
