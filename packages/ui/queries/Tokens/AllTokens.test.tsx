import { describe, it, expect, beforeEach, type vi } from 'vitest';
import fetchAllTokens from './AllTokens';



describe('fetchAllTokens', () => {
  beforeEach(() => {
  });

  it('logs the API response', async () => {
    const apiUrl = 'https://story-odyssey-ponder.standardweb3.com';
    const limit = 10;
    const page = 1;

    const allTokens = await fetchAllTokens(apiUrl, limit, page);

    console.log("all tokens: ", allTokens);

  });
});