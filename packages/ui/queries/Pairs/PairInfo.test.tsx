import { describe, it, expect, beforeEach, type vi } from 'vitest';
import fetchPairInfo from './PairInfo';



describe('fetchPairInfo', () => {
  beforeEach(() => {
  });

  it('logs the API response', async () => {
    const apiUrl = 'https://story-odyssey-ponder.standardweb3.com';
    const base = '0xe8CabF9d1FFB6CE23cF0a86641849543ec7BD7d5';
    const quote = '0x40fCa9cB1AB15eD9B5bDA19A52ac00A78AE08e1D';

    const pairInfo = await fetchPairInfo(apiUrl, base, quote);

    console.log("pair info:", pairInfo);

  });
});