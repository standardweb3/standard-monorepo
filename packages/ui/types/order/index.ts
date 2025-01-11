import type { Token } from 'types';

export type DeleteOrderEvent = {
  id: string;
  timestamp: number;
};

export type OrderEvent = {
  /// a unique identifier
  id: string;
  /// order type (bid(buy) if 1, ask(sell) if 0)
  isBid: number;
  /// placed order id
  orderId: number;
  /// base token address
  base: string;
  /// quote token address
  quote: string;
  /// pair string
  symbol: string;
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
  symbol: string;
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
