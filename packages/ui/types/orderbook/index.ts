export type Tick = {
  id: string;
  orderbook: string;
  price: number;
  amount: number;
  count: number;
};

export type Orderbook = {
  orderbook: string;
  mktPrice: number;
  bidHead: number;
  askHead: number;
  bids: Tick[];
  asks: Tick[];
  lastUpdated: number;
};

/// Orderbook events from websocket
export type TickEvent = {
  id: string;
  isBid: boolean;
  orderbook: string;
  price: number;
  amount: number;
  count: number;
  timestamp: number;
};

export type MarketPriceEvent = {
  id: string;
  price: number;
  timestamp: number;
};

export type DeleteTickEvent = {
  id: string;
  isBid: boolean;
  timestamp: number;
};
