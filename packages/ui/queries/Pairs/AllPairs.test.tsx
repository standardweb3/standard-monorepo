import { describe, it, expect, beforeEach, type vi } from 'vitest';
import fetchAllPairs from './AllPairs';



describe('fetchAllPairs', () => {
  beforeEach(() => {
  });

  it('logs the API response', async () => {
    const apiUrl = 'https://story-odyssey-ponder.standardweb3.com';
    const limit = 10;
    const page = 1;

    const allPairs = await fetchAllPairs(apiUrl, limit, page);

    console.log(allPairs);

  });
});