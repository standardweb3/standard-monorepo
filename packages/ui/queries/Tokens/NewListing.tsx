"use server";
import axios from 'axios';
import type { TokenData } from 'types';

export const fetchNewListingTokens = async (
  apiUrl: string,
  limit: number,
  page: number
) => {
  const response = await axios.get(
    `${apiUrl}/api/tokens/new/${limit}/${page}`
  );

  const data = response.data;

  return data.tokens as TokenData;
};

export default fetchNewListingTokens;