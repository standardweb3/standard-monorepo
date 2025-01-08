import { describe, it, expect, beforeEach, type vi } from 'vitest';
import fetchTokenInfo from './TokenInfo';



describe('fetchTokenInfo', () => {
  beforeEach(() => {
  });

  it('logs the API response', async () => {
    const apiUrl = 'https://story-odyssey-ponder.standardweb3.com';
    const address = '0xe8CabF9d1FFB6CE23cF0a86641849543ec7BD7d5';

    const pairInfo = await fetchTokenInfo(apiUrl, address);

    console.log("token info:", pairInfo);

  });
});