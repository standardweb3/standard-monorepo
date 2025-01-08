'use server';
import { getAddress } from 'viem';
import dotenv from 'dotenv';
import axios from 'axios';
import type { Token } from 'queries/Tokens/AllTokens';

dotenv.config();

export type TradeHistory = {
  id: string;
  orderId: number;
  /// order type (bid(buy) if 1, ask(sell) if 0)
  isBid: number;
  base: Token;
  quote: Token;
  /// pair string
  pair: string;
  orderbook: string;
  price: number;
  amount: number;
  timestamp: number;
  maker: string;
  taker: string;
  account: string;
  txHash: string;
};

export type AccountTradeHistory = {
  trades: TradeHistory[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
  lastUpdated: number;
};

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
