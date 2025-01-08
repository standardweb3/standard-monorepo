import { describe, it, expect, beforeEach, type vi } from 'vitest';
import fetchTopLoserPairs from './TopLoser';



describe('fetchAllPairs', () => {
  beforeEach(() => {
  });

  it('logs the API response', async () => {
    const apiUrl = 'https://story-odyssey-ponder.standardweb3.com';
    const limit = 10;
    const page = 1;

    const allPairs = await fetchTopLoserPairs(apiUrl, limit, page);

    console.log(allPairs);

  });
});