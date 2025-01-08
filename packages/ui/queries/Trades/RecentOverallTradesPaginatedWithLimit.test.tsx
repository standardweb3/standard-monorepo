import { describe, it, expect, beforeEach, type vi } from 'vitest';
import fetchRecentOverallTradesPaginated from './RecentOverallTradesPaginatedWithLimit';



describe('fetchUserAccountOrders', () => {
  beforeEach(() => {
  });

  it('logs the API response', async () => {
    const apiUrl = 'https://story-odyssey-ponder.standardweb3.com';
    const limit = 10;
    const page = 1;

    const accountTradeHistory = await fetchRecentOverallTradesPaginated(apiUrl, limit, page);

    console.log(accountTradeHistory);

  });
});