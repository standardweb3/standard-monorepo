'use server';
import axios from 'axios';
import type { Pair } from './AllPairs';

export const fetchTopLoserPairs = async (
  apiUrl: string,
  limit: number,
  page: number,
) => {
  const response = await axios.get(`${apiUrl}/api/pairs/top-loser/${limit}/${page}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ADMIN_API_KEY || '',
    },
  });

  const data = response.data;

  return data.pairs as Pair[];
};

export default fetchTopLoserPairs;