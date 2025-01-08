interface Enums {
  [key: string]: string;
}

interface ChainIds {
  [key: string]: number;
}

// Keys are network name from Wagmi library, values are the corresponding key in the Transak SDK.
export const RampChains: Enums = {
  Ethereum: 'ETHEREUM',
  Polygon: 'POLYGON',
  'Arbitrum One': 'ARBITRUM',
  Optimism: 'OPTIMISM',
};

// Keys are network name from Wagmi library, values are the corresponding key in the DefaultTokenList SDK.
export const DefaultTokenListChains: Enums = {
  Ethereum: 'ethereum',
  Polygon: 'polygon-pos',
  Evmos: 'evmos',
  'Arbitrum One': 'arbitrum-one',
  Optimism: 'optimistic-ethereum',
  'Base Goerli': 'base-goerli',
  'Kucoin Community Chain': 'kucoin-community-chain',
  'Linea Goerli Testnet': 'linea-testnet',
  'Linea Mainnet': 'linea',
  'Mode Mainnet': 'mode',
  'Blast Mainnet': 'blast',
  'Neon Mainnet': 'neon-evm',
  'Injective EVM': 'inevm',
  'Astar ZKEVM': 'astar-zkevm',
  Base: 'base',
  Kroma: 'kroma',
  'Morph Holesky': 'morph-holesky',
  'Story Odyssey Testnet': 'story-odyssey',
  Morph: 'morph',
};

export const NoticeOnChain: Enums = {
  'Morph Holesky': '',
};

export const ChainIds: ChainIds = {
  Ethereum: 1,
  Polygon: 137,
  Evmos: 246,
  'Arbitrum One': 42161,
  Optimism: 10,
  'ZkSync Testnet': 280,
  'ZkSync Mainnet': 324,
  'Binance Smart Chain': 56,
  'Mantle Testnet': 5001,
  'Base Goerli': 84531,
  'Kucoin Community Chain': 321,
  'Linea Goerli Testnet': 59140,
  'Linea Mainnet': 59_144,
  'Mode Mainnet': 34_443,
  'Neon Mainnet': 245022934,
  'Injective EVM': 2525,
  'Astar ZKEVM': 3776,
  Base: 8453,
  Kroma: 255,
  'Morph Holesky': 2810,
  Scroll: 534352,
  'Taiko Mainnet': 167000,
  'Story Public Testnet': 1513,
  'Story Odyssey Testnet': 1516,
  Morph: 2818,
};

// Keys are pathname from Next.js router, values are the corresponding title.
export const HeadTitle: Enums = {
  '/signin': 'Sign In',
  '/get-started': 'Get Started',
  '/unsupported': 'Unsupported Network',
  'unsupported?unsupportedChain=Chain+1': 'Unsupported Network',
  '/account/dashboard': 'Dashboard',
  '/account/transfer': 'Transfer',
  '/account/receive': 'Receive',
  '/account/bridge': 'Bridge',
  '/account/orders': 'Orders',
  '/account/membership': 'Membership',
  '/pools': 'Pools',
  '/earn': 'Earn',
  '/market': 'Market',
  '/buy-sell-crypto': 'Buy & Sell Crypto',
  '/trade': 'Trade',
  '/': 'Get Started',
};

export const PonderLinks: Enums = {
  Base: 'https://test-cors.standardweb3.com',
  'Mode Mainnet': 'https://standard20-ponder-production-4f1a.up.railway.app',
  'Blast Mainnet': 'https://standard20-ponder-production.up.railway.app',
  Kroma: 'https://kroma-ponder-20240724.standardweb3.com',
  'Emoney testnet': 'https://emoney-testnet-ponder.standardweb3.com',
  'Morph Holesky': 'https://v4-morph-holesky-ponder.standardweb3.com',
  Scroll: 'https://scroll-ponder.standardweb3.com',
  'Taiko Mainnet': 'https://taiko-ponder.standardweb3.com',
  'Story Public Testnet': 'https://v4.story-iliad-ponder.standardweb3.com',
  'Story Odyssey Testnet': 'https://story-odyssey-ponder.standardweb3.com',
  Morph: 'https://morph-ponder.standardweb3.com',
};

export const PonderWssLinks: Enums = {
  Base: 'wss://base-ponder-websocket-standard.up.railway.app',
  Kroma: 'wss://kroma-websocket-20240724.standardweb3.com',
  'Morph Holesky': 'wss://v4-morph-holesky-websocket.standardweb3.com',
  Scroll: 'wss://scroll-websocket.standardweb3.com',
  'Taiko Mainnet': 'wss://taiko-websocket.standardweb3.com',
  'Story Public Testnet': 'wss://v4.story-iliad-websocket.standardweb3.com',
  'Story Odyssey Testnet': 'wss://story-odyssey-websocket.standardweb3.com',
  Morph: 'wss://morph-websocket.standardweb3.com',
};

export const Menus = {
  Default: {
    Home: {
      isLeft: true,
      hasDropdown: false,
      link: '/',
    },
    Trade: {
      isLeft: true,
      hasDropdown: false,
      link: '/trade',
    },
    /*
      "Point": {
        "isLeft": true,
        "hasDropdown": false,
        "link": "/point"
      },
      */
    'Buy STND': {
      isLeft: true,
      hasDropdown: false,
      link: 'https://linktr.ee/standardprotocol',
    },
  },
};
