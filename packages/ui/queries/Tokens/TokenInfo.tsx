'use server';
import axios from 'axios';
import type { TokenInfo } from 'types';

export const fetchTokenInfo = async (apiUrl: string, address: string) => {
  const response = await axios.get(`${apiUrl}/api/token/${address}`);

  const data = response.data;

  return {
    ...data.token,
    latestMinBucket: data.latestMinBucket,
    latestHourBucket: data.latestHourBucket,
    latestDayBucket: data.latestDayBucket,
    latestWeekBucket: data.latestWeekBucket,
    latestMonthBucket: data.latestMonthBucket,
  } as TokenInfo;
};

export default fetchTokenInfo;
