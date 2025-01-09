'use server';
import axios from 'axios';
import type { PairData } from 'types';


export const fetchAllPairs = async (
  apiUrl: string,
  limit: number,
  page: number,
): Promise<PairData> => {
  const response = await axios.get(`${apiUrl}/api/pairs/${limit}/${page}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ADMIN_API_KEY || '',
    },
  });

  const data: PairData = response.data;

  return data;
};

export default fetchAllPairs;
