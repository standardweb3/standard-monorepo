import type { Token } from 'types';

export type UpdateTradeEvent = {
  id: string;
  orderId: number;
  base: string;
  quote: string;
  symbol: string;
  isBid: number;
  price: number;
  orderbook: string;
  baseAmount: number;
  quoteAmount: number;
  timestamp: number;
  taker: string;
  maker: string;
  txHash: string;
};

export type Trade = {
  /// identifier for a trade
  id: string;
  /// orderbook contract address
  orderbook: string;
  /// order id which was matched
  orderId: number;
  /// base info
  base: Token;
  /// quote info
  quote: Token;
  /// pair string
  symbol: string;
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

export type TradesData = {
  trades: Trade[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
  lastUpdated: number;
};
