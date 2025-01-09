"use server";
import { getAddress } from "viem";
import axios from 'axios';
import type { TradesData } from "types";

export const fetchRecentPairTradesPaginated = async (
  apiUrl: string,
  base: string,
  quote: string,
  limit: number,
  page: number
) => {
  const encodedBase = getAddress(base);
  const encodedQuote = getAddress(quote);
  const response = await axios.get(
    `${apiUrl}/api/trades/${encodedBase}/${encodedQuote}/${limit}/${page}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ADMIN_API_KEY || "",
      },
    }
  );

  const data = response.data;

  return {
    ...data,
    lastUpdated: Date.now(),
  } as TradesData;
};

export default fetchRecentPairTradesPaginated;