"use server";
import axios from 'axios';
import type { Token } from './AllTokens';

export const fetchTopLoserTokens = async (
  apiUrl: string,
  limit: number,
  page: number
) => {
  const response = await axios.get(
    `${apiUrl}/api/tokens/top-loser/${limit}/${page}`
  );

  const data = response.data;

  return data.tokens as Token[];
};

export default fetchTopLoserTokens;