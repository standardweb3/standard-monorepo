"use server";
import axios from 'axios';
import { getAddress } from 'viem';

export const setTokenInfo = async (
  apiUrl: string,
  tokenAddress: string,
  tokenData: object,
  adminApiKey: string
) => {
    const encoded = getAddress(tokenAddress);
  const options = {
    method: 'POST',
    url: `${apiUrl}/api/token/set/${encoded}`,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Api-Key': adminApiKey,
    },
    data: tokenData,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to set token information');
  }
};

export default setTokenInfo;