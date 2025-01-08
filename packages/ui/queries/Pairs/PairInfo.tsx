"use server";

import { getAddress } from "viem";
import axios from 'axios';
import type { Pair } from "./AllPairs";


export const fetchPairInfo = async (
  apiUrl: string,
  base: string,
  quote: string,
) => {
  const encodedBase = getAddress(base);
  const encodedQuote = getAddress(quote);
  const response = await axios.get(
    `${apiUrl}/api/pair/${encodedBase}/${encodedQuote}`
  );

  const data = response.data;

  return data as Pair;
};

export default fetchPairInfo;