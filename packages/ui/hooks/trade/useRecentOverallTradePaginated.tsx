"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchRecentOverallTradesPaginated } from "@/queries";
import { GraphQLClient } from "graphql-request";
import { PonderLinks } from "@/enums";

export const useRecentOverallTradePaginated = (
  networkName: string,
  tokenlist: any[],
) => {
  // GraphQL setup
  const apiUrl: string = PonderLinks[networkName];
  const client = new GraphQLClient(apiUrl);
  const queryClient = useQueryClient();

  
  const queryKey = [
    `recent-trade-overall-${networkName}`,
  ];

  const [cursor, setCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchWithCursor = async (
    cursor: string | null,
    client: GraphQLClient
  ) => {
    const tokens: any[] = queryClient.getQueryData([`tokenlist-${networkName}`])!;
    const data = await fetchRecentOverallTradesPaginated(tokens, cursor, client);
    setPrevCursor(data?.startCursor);
    setNextCursor(data?.endCursor);
    return data;
  };

  const { data, error, status } = useQuery({
    queryKey,
    queryFn: () => fetchWithCursor(cursor, client),
    placeholderData: (previousData, _previousQuery) => previousData,
    staleTime: Infinity,
  });

  const fetchNext = () => {
    if (data !== undefined && data?.hasNextPage) {
      setCursor(nextCursor);
      queryClient.invalidateQueries({ queryKey });
    }
  };

  const fetchPrev = () => {
    if (data !== undefined && data?.hasPreviousPage) {
      setCursor(prevCursor);
      queryClient.invalidateQueries({ queryKey });
    }
  };

  const previousData = queryClient.getQueryData(queryKey);
  if (status === "pending" || status === "error") {
    return {
      data: (previousData as { trades: any[]})?.trades,
      error,
      status,
      queryKey,
    };
  } else {
    return {
      fetchNext,
      fetchPrev,
      hasPreviousPage: data?.hasPreviousPage,
      hasNextPage: data?.hasNextPage,
      data: data?.trades,
      error,
      status,
      queryKey,
    };
  }
};
