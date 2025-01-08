import { describe, it, expect, beforeEach, type vi } from 'vitest';
import fetchTopLoser from './TopLoser';

describe('fetchTopLoser', () => {
  beforeEach(() => {});

  it('logs the API response', async () => {
    const apiUrl = 'https://story-odyssey-ponder.standardweb3.com';
    const limit = 10;
    const page = 1;

    const allTokens = await fetchTopLoser(apiUrl, limit, page);

    console.log('all tokens: ', allTokens);
  });
});
