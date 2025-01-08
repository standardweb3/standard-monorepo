import { describe, it, expect, beforeEach, type vi } from 'vitest';
import fetchRecentPairTradesPaginated from './RecentPairTradesPaginatedWithLimit';



describe('fetchUserAccountOrders', () => {
  beforeEach(() => {
  });

  it('logs the API response', async () => {
    const apiUrl = "https://standard-v4-ponder-production.up.railway.app";
    const base = '0xe8CabF9d1FFB6CE23cF0a86641849543ec7BD7d5';
    const quote = '0x40fCa9cB1AB15eD9B5bDA19A52ac00A78AE08e1D';
    const limit = 10;
    const page = 1;

    const recentPairTrades = await fetchRecentPairTradesPaginated(apiUrl, base, quote, limit, page);

    console.log(recentPairTrades);

  });
});