import type { Token } from 'types';

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
    tradeHistory: TradeHistory[];
    totalCount: number;
    totalPages: number;
    pageSize: number;
    lastUpdated: number;
  };