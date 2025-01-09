'use server';
import { getAddress } from 'viem';
import dotenv from 'dotenv';
import axios from 'axios';
import type { AccountTradeHistory } from 'types';

dotenv.config();


export const fetchUserAccountTradeHistoryPaginatedWithLimit = async (
  apiUrl: string,
  address: string,
  limit: number,
  page: number,
) => {
  const encoded = getAddress(address);
  const response = await axios.get(
    `${apiUrl}/api/tradehistory/${encoded}/${limit}/${page}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ADMIN_API_KEY || '',
      },
    },
  );

  const data = response.data;

  return {
    ...data,
    lastUpdated: Date.now(),
  } as AccountTradeHistory;
};

export default fetchUserAccountTradeHistoryPaginatedWithLimit;
