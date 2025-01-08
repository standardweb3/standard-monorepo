'use server';
import axios from 'axios';
import type { Token } from '../Tokens/AllTokens';

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
  dayDifference: number;
  dayDifferencePercentage: number;
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
  count: number;
  baseVolume: number;
  quoteVolume: number;
  baseVolumeUSD: number;
  quoteVolumeUSD: number;
  baseTvl: number;
  quoteTvl: number;
  baseTvlUSD: number;
  quoteTvlUSD: number;
}

export const fetchAllPairs = async (
  apiUrl: string,
  limit: number,
  page: number,
): Promise<Pair[]> => {
  const response = await axios.get(`${apiUrl}/api/pairs/${limit}/${page}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ADMIN_API_KEY || '',
    },
  });

  const data = response.data;

  return data.pairs as Pair[];
};

export default fetchAllPairs;
