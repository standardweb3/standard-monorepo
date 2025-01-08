"use server";
import axios from 'axios';

export type Trade = {
  /// identifier for a trade
  id: string;
  /// orderbook contract address
  orderbook: string;
  /// order id which was matched
  orderId: number;
  /// base info
  base: string;
  /// quote info
  quote: string;
  /// pair string
  pair: string;
  /// order type (bid(buy) if 1, ask(sell) if 0)
  isBid: number;
  /// price in 8 decimals
  price: number;
  /// traded base token amount on isBid == false, traded quote token amount on isBid == true
  baseAmount: number;
  /// traded quote token amount on isBid == false, traded base token amount on isBid == true
  quoteAmount: number;
  /// submitted timestamp
  timestamp: number;
  /// taker of the matched order in the orderbook
  taker: string;
  /// maker of the matched order in the orderbook
  maker: string;
  /// transaction hash
  txHash: string;
};

export const fetchRecentOverallTradesPaginated = async (
  apiUrl: string,
  limit: number,
  page: number
) => {
  const response = await axios.get(
    `${apiUrl}/api/trades/${limit}/${page}`,
    {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ADMIN_API_KEY || "",
      },
    }
  );

  const data = response.data;

  return data.trades as Trade[];
};

export default fetchRecentOverallTradesPaginated;