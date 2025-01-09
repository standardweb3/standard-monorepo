'use server';
import axios from 'axios';
import type { PairData } from 'types';

export const fetchNewListingPairs = async (
  apiUrl: string,
  limit: number,
  page: number,
) => {
  const response = await axios.get(`${apiUrl}/api/pairs/new/${limit}/${page}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ADMIN_API_KEY || '',
    },
  });

  const data = response.data;

  return data.pairs as PairData;
};

export default fetchNewListingPairs;