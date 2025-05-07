"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

// Sample token data with unique background images
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
    backgroundUrl: '/token-image/cryptopunk2.jpeg'
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
    backgroundUrl: '/token-image/background/yield-bg.jpeg'
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
    backgroundUrl: '/token-image/background/moondog-bg.jpeg'
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
    backgroundUrl: '/token-image/background/stableusd-bg.jpeg'
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
    backgroundUrl: '/token-image/background/gameitem-bg.jpeg'
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
    backgroundUrl: '/token-image/background/artcollection-bg.jpeg'
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
    logoUrl: '/token-image/overnance.jpeg',
    backgroundUrl: '/token-image/overnance.jpeg/goverment.jpeg'
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
    backgroundUrl: '/token-image/defiindex2.jpeg'
  }
];

// Filter types for our tokens
const tokenTypes: TokenType[] = ['ERC-20', 'ERC-721', 'ERC-1155', 'Memecoin', 'Stablecoin'];

export default function TokenListingPage() {
  const [filterType, setFilterType] = useState<TokenType | 'All'>('All');
  
  // Filter tokens based on selected type
  const filteredTokens = filterType === 'All' 
    ? sampleTokens 
    : sampleTokens.filter(token => token.type === filterType);

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
    
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Token Listings</h1>
          
          <div className="relative">
            <select 
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TokenType | 'All')}
            >
              <option value="All">All Token Types</option>
              {tokenTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Token Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTokens.map(token => (
            <Link 
              key={token.id} 
              href={`/token/${token.id}`}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="relative h-48">
                {/* Unique background image for each token */}
                <div className="absolute inset-0 bg-gray-700 overflow-hidden">
                  <Image 
                    src={token.backgroundUrl} 
                    alt={token.name} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={token.id === '1'}
                  />
                </div>
                
                <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 px-3 py-1 rounded-full text-sm">
                  {token.type}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center">
                    <div className="relative w-10 h-10 rounded-full mr-3 bg-white overflow-hidden">
                      <Image 
                        src={token.logoUrl} 
                        alt={token.name} 
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{token.name}</h3>
                      <p className="text-gray-300">{token.symbol}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Network</span>
                  <span>{token.network}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Supply</span>
                  <span>{token.supply}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deployment</span>
                  <span className="text-purple-400">{token.price}</span>
                </div>
              </div>

              <div className="border-t border-gray-700 p-4">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors">
                  View Details
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>

  );
}