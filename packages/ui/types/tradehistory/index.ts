import type { Token } from 'types';

export type UpdateTradeHistoryEvent = {
  id: string;
  orderId: number;
  base: string;
  quote: string;
  symbol: string;
  isBid: number;
  orderbook: string;
  price: number;
  amount: number;
  taker: string;
  maker: string;
  account: string;
  timestamp: number;
  txHash: string;
};

export type TradeHistory = {
  id: string;
  orderId: number;
  /// order type (bid(buy) if 1, ask(sell) if 0)
  isBid: number;
  base: Token;
  quote: Token;
  /// pair string
  symbol: string;
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
  tradeHistory: TradeHistory[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
  lastUpdated: number;
};
