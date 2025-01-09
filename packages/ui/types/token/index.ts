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
};

export type TokenBucket = {
  /// {token address}-{hour}
  id: string;
  /// index to find previous bucket
  index: number;
  /// token address
  token: string;
  /// open price in 1 hour related to asset in USD
  open: number;
  /// high price in 1 hour related to asset in USD
  high: number;
  /// low price in 1 hour related to asset in USD
  low: number;
  /// close price in 1 hour related to asset in USD
  close: number;
  /// average price in 1 hour related to asset in USD
  average: number;
  /// difference from open to close
  difference: number;
  /// difference from open to close in percentage
  differencePercentage: number;
  /// total value locked
  tvl: number;
  /// total value locked in USD
  tvlUSD: number;
  /// volume in 1 hour for the asset
  volume: number;
  /// volume in 1 hour for the asset in USD
  volumeUSD: number;
  /// trade count
  count: number;
  /// aggregated timestamp in 24 hours in seconds
  timestamp: number;
};

export type TokenInfo = {
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
  latestMinBucket: TokenBucket;
  latestHourBucket: TokenBucket;
  latestDayBucket: TokenBucket;
  latestWeekBucket: TokenBucket;
  latestMonthBucket: TokenBucket;
};

export type TokenData = {
    tokens: Token[];
    totalCount: number;
    totalPages: number;
    pageSize: number;
}