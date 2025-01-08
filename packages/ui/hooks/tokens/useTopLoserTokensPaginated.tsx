'use client';
import { PonderLinks } from '../../enums';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import fetchTopLoserTokens from '../../queries/Tokens/TopLoser';
import type { Token } from '../../queries/Tokens/AllTokens';

export const useTopLoserTokensPaginated = (network: string, limit: number, page: number) => {
  const apiUrl: string = PonderLinks[network];
  const queryKey = [`allTokens-top-loser-${network}`];
  const queryClient = useQueryClient();

  const fetchTokens = async () => {
    try {
      const tokens: Token[] = await fetchTopLoserTokens(apiUrl, limit, page);
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
