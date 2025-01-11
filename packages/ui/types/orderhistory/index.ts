import type { Token } from "types";

export type OrderHistory = {
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
    account: string;
    txHash: string;
  };
  
  export type AccountOrderHistory = {
    orderHistory: OrderHistory[];
    totalCount: number;
    totalPages: number;
    pageSize: number;
    lastUpdated: number;
  };