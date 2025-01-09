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
