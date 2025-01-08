"use server";
import axios from 'axios';

export type Token = {
  id: string;
  name: string;
  symbol: string;
  ticker: string;
  totalSupply: number;
  logoURI: string;
  decimals: number;
  price: number;
  cpPrice: number;
  cgId: string;
  cmcId: string;
  ath: number;
  atl: number;
  listingDate: number;
  dayDifference: number;
  dayDifferencePercentage: number;
  dayTvl: number;
  dayTvlUSD: number;
  dayVolume: number;
  dayVolumeUSD: number;
  creator: string | null;
  totalMinBuckets: number;
  totalHourBuckets: number;
  totalDayBuckets: number;
  totalWeekBuckets: number;
  totalMonthBuckets: number;
}

export const fetchAllTokens = async (
  apiUrl: string,
  limit: number,
  page: number
) => {
  const response = await axios.get(
    `${apiUrl}/api/tokens/${limit}/${page}`
  );

  const data = response.data;

  return data.tokens as Token[];
};

export default fetchAllTokens;