"use server";
import { getAddress } from "viem";
import dotenv from 'dotenv';
import axios from 'axios';
import type { Orderbook } from 'types';

dotenv.config();

export const fetchOrderbook = async (
  apiUrl: string,
  base: string,
  quote: string,
): Promise<Orderbook> => {
  const encodedBase = getAddress(base);
  const encodedQuote = getAddress(quote);
  const response = await axios.get(
    `${apiUrl}/api/orderbook/${encodedBase}/${encodedQuote}/100`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ADMIN_API_KEY || "",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = response.data;
  
  const bidHead = data.bids[0]?.price;
  const askHead = data.asks[0]?.price;

  return {
    orderbook: data.id,
    mktPrice: data.mktPrice,
    bidHead,
    askHead,
    bids: data.bids,
    asks: data.asks,
    lastUpdated: Date.now(),
  };
};

export default fetchOrderbook;