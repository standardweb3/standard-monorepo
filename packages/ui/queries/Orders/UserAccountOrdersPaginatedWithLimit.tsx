"use server";
import { getAddress } from "viem";
import dotenv from 'dotenv';
import axios from 'axios';
import type { Token } from "queries/Tokens/AllTokens";

dotenv.config();

export type Order = {
  /// a unique identifier
  id: string;
  /// order type (bid(buy) if 1, ask(sell) if 0)
  isBid: number;
  /// placed order id
  orderId: number;
  /// base token address
  base: Token;
  /// quote token address
  quote: Token;
  /// pair string
  pair: string;
  /// orderbook contract address
  orderbook: string;
  /// price in 8 decimals
  price: number;
  /// deposit asset amount
  amount: number;
  /// placed asset amount
  placed: number;
  /// submitted timestamp
  timestamp: number;
  /// wallet address who made an order
  account: string;
  /// transaction hash
  txHash: string;
};

export type AccountOrders = {
  orders: Order[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
  lastUpdated: number;
};


export const fetchUserAccountOrdersPaginatedWithLimit = async (
  apiUrl: string,
  address: string,
  limit: number,
  page: number,
) => {
  const encoded = getAddress(address);
  const response = await axios.get(
    `${apiUrl}/api/orders/${encoded}/${limit}/${page}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ADMIN_API_KEY || "",
      },
    }
  );

  const data = response.data;

  return {
    ...data,
    lastUpdated: Date.now(),
  } as AccountOrders;
};

export default fetchUserAccountOrdersPaginatedWithLimit;