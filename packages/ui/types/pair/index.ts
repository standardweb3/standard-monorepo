import type { Token } from 'types';

export type Pair = {
  id: string;
  symbol: string;
  ticker: string;
  description: string;
  type: string;
  exchange: string;
  base: Token;
  quote: Token;
  price: number;
  ath: number;
  atl: number;
  listingDate: number;
  dayPriceDifference: number;
  dayPriceDifferencePercentage: number;
  dayBaseVolume: number;
  dayQuoteVolume: number;
  dayBaseVolumeUSD: number;
  dayQuoteVolumeUSD: number;
  dayBaseTvl: number;
  dayQuoteTvl: number;
  dayBaseTvlUSD: number;
  dayQuoteTvlUSD: number;
  orderbook: string;
  bDecimal: number;
  qDecimal: number;
  totalMinBuckets: number;
  totalHourBuckets: number;
  totalDayBuckets: number;
  totalWeekBuckets: number;
  totalMonthBuckets: number;
};

export type PairData = {
  pairs: Pair[];
  totalCount: number;
  totalPages: number;
  pageSize: number;
};
