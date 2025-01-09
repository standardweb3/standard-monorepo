'use server';
import axios from 'axios';
import type { TradesData } from 'types';


export const fetchRecentOverallTradesPaginated = async (
  apiUrl: string,
  limit: number,
  page: number,
) => {
  const response = await axios.get(`${apiUrl}/api/trades/${limit}/${page}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ADMIN_API_KEY || '',
    },
  });

  const data = response.data;

  return {
    ...data,
    lastUpdated: Date.now(),
  } as TradesData;
};

export default fetchRecentOverallTradesPaginated;
