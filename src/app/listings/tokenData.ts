// Token type definition
export type TokenType = 'ERC-20' | 'ERC-721' | 'ERC-1155' | 'Memecoin' | 'Stablecoin';
export interface Token {
  id: string;
  name: string;
  symbol: string;
  type: TokenType;
  supply: string;
  price: string;
  creator: string;
  address: string;
  network: string;
  createdAt: string;
  description: string;
  features: string[];
  logoUrl: string;
  backgroundUrl: string;
}

// Move your sample data here
export const sampleTokens: Token[] = [
  {
    id: '1',
    name: 'CryptoPunk Token',
    symbol: 'CPT',
    type: 'ERC-721',
    supply: '10,000',
    price: '$2,500',
    creator: 'Punk Labs',
    address: '0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b',
    network: 'Ethereum',
    createdAt: '2025-01-15',
    description: 'A collection of unique digital art tokens on the Ethereum blockchain.',
    features: ['Royalty support', 'Metadata included', 'Marketplace ready'],
    logoUrl: '/token-image/cryptopunk1.png',
    backgroundUrl: '/token-image/cryptopunk3.jpg',
  },
  {
    id: '2',
    name: 'Yield Finance',
    symbol: 'YFI',
    type: 'ERC-20',
    supply: '30,000',
    price: '$1,500',
    creator: 'DeFi Team',
    address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    network: 'Ethereum',
    createdAt: '2025-02-10',
    description: 'Governance token for decentralized finance protocol.',
    features: ['Mintable', 'Governance', 'Staking rewards'],
    logoUrl: '/token-image/yieldfinance.jpeg',
    backgroundUrl: '/token-image/background/yield-bg.jpeg',
  },
  {
    id: '3',
    name: 'Moon Dog',
    symbol: 'MDOG',
    type: 'Memecoin',
    supply: '1,000,000,000',
    price: '$3,500',
    creator: 'Meme Labs',
    address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
    network: 'Binance Smart Chain',
    createdAt: '2025-03-05',
    description: 'Community-driven memecoin with deflationary mechanics.',
    features: ['Anti-whale', '2% redistribution', 'Liquidity locked'],
    logoUrl: '/token-image/moondog.jpeg',
    backgroundUrl: '/token-image/moondog3.jpg',
  },
  {
    id: '4',
    name: 'Stable USD',
    symbol: 'SUSD',
    type: 'Stablecoin',
    supply: '5,000,000',
    price: '$5,500',
    creator: 'Stable Finance',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    network: 'Ethereum',
    createdAt: '2025-02-28',
    description: 'Fully collateralized USD-pegged stablecoin.',
    features: ['1:1 USD backing', 'Low volatility', 'Regular audits'],
    logoUrl: '/token-image/stableusd.png',
    backgroundUrl: '/token-image/background/stableusd-bg.jpeg',
  },
  {
    id: '5',
    name: 'Game Items',
    symbol: 'GITM',
    type: 'ERC-1155',
    supply: 'Variable',
    price: '$7,500',
    creator: 'GameFi Studios',
    address: '0x3B3525F60eeAf3C9936B874B329F9d681Db5e52C',
    network: 'Polygon',
    createdAt: '2025-03-10',
    description: 'Multi-token standard for in-game assets and collectibles.',
    features: ['Mixed fungible/non-fungible', 'Batch transfers', 'Gaming integration'],
    logoUrl: '/token-image/gameitem.jpeg',
    backgroundUrl: '/token-image/game item2.jpg',
  },
  {
    id: '6',
    name: 'Art Collection',
    symbol: 'ARTC',
    type: 'ERC-721',
    supply: '1,000',
    price: '$15,500',
    creator: 'Digital Artists Collective',
    address: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
    network: 'Ethereum',
    createdAt: '2025-01-25',
    description: 'Limited edition digital art pieces with provenance.',
    features: ['Provenance tracking', 'Artist royalties', 'High-res metadata'],
    logoUrl: '/token-image/artcollection.jpeg',
    backgroundUrl: '/token-image/artcollection2.jpg',
  },
  {
    id: '7',
    name: 'Governance DAO',
    symbol: 'GDAO',
    type: 'ERC-20',
    supply: '100,000',
    price: '$5,500',
    creator: 'DAO Builders',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    network: 'Ethereum',
    createdAt: '2025-02-01',
    description: 'Token for decentralized governance of protocol decisions.',
    features: ['Voting rights', 'Proposal creation', 'Treasury management'],
    logoUrl: '/token-image/goverment.jpeg',
    backgroundUrl: '/token-image/governacedao2.jpg',
  },
  {
    id: '8',
    name: 'DeFi Index',
    symbol: 'DIDX',
    type: 'ERC-20',
    supply: '50,000',
    price: '$5,500',
    creator: 'Index Labs',
    address: '0x0954906da0Bf32d5479e25f46056d22f08464cab',
    network: 'Ethereum',
    createdAt: '2025-03-15',
    description: 'Index token representing a basket of DeFi assets.',
    features: ['Auto-rebalancing', 'Diversified exposure', 'Low management fee'],
    logoUrl: '/token-image/defiindex.jpeg',
    backgroundUrl: '/token-image/defiindex2.jpg',
  },
];



