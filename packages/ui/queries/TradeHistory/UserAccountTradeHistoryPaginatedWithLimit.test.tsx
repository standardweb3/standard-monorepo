import { describe, it, expect, beforeEach, type vi } from 'vitest';
import fetchUserAccountTradeHistoryPaginatedWithLimit from './UserAccountTradeHistoryPaginatedWithLimit';



describe('fetchUserAccountOrders', () => {
  beforeEach(() => {
  });

  it('logs the API response', async () => {
    const apiUrl = 'https://story-odyssey-ponder.standardweb3.com';
    const address = "0xF8FB4672170607C95663f4Cc674dDb1386b7CfE0";
    const limit = 10;
    const page = 1;

    const accountTradeHistory = await fetchUserAccountTradeHistoryPaginatedWithLimit(apiUrl, address, limit, page);

    console.log(accountTradeHistory);

  });
});