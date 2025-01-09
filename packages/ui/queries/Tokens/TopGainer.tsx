"use server";
import axios from 'axios';
import type { TokenData } from 'types';

export const fetchTopGainerTokens = async (
  apiUrl: string,
  limit: number,
  page: number
) => {
  const response = await axios.get(
    `${apiUrl}/api/tokens/top-gainer/${limit}/${page}`
  );

  const data = response.data;

  return data.tokens as TokenData;
};

export default fetchTopGainerTokens;