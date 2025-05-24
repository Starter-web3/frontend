'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TokenType, sampleTokens } from './tokenData';

// Filter types for our tokens
const tokenTypes: TokenType[] = ['ERC-20', 'ERC-721', 'ERC-1155', 'Memecoin', 'Stablecoin'];

export default function TokenListingPage() {
  const [filterType, setFilterType] = useState<TokenType | 'All'>('All');

  // Filter tokens based on selected type
  const filteredTokens =
    filterType === 'All' ? sampleTokens : sampleTokens.filter((token) => token.type === filterType);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white'>
      {/* Main Content */}
      <main className='container mx-auto py-8 px-4'>
        <div className='flex justify-between items-center mb-8'>
          
          <div className='relative'>
            <select
              className='bg-gray-800 border border-gray-700 text-white rounded-md px-4 py-2 appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500'
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TokenType | 'All')}
            >
              <option value='All'>All Tokens</option>
              {tokenTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
              <svg
                className='w-5 h-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 9l-7 7-7-7'
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Token Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {filteredTokens.map((token) => (
            <Link
              key={token.id}
              href={`/token/${token.id}`}
              className='bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer'
            >
              <div className='relative h-48'>
                {/* Unique background image for each token */}
                <div className='absolute inset-0 bg-gray-700 overflow-hidden'>
                  <Image
                    src={token.backgroundUrl}
                    alt={token.name}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, 50vw'
                    priority={token.id === '1'}
                  />
                </div>

                <div className='absolute top-2 right-2 bg-gray-900 bg-opacity-70 px-3 py-1 rounded-full text-sm'>
                  {token.type}
                </div>
                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4'>
                  <div className='flex items-center'>
                    <div className='relative w-10 h-10 rounded-full mr-3 bg-white overflow-hidden'>
                      <Image
                        src={token.logoUrl}
                        alt={token.name}
                        fill
                        className='object-cover'
                        sizes='40px'
                      />
                    </div>
                    <div>
                      <h3 className='font-bold text-xl'>{token.name}</h3>
                      <p className='text-gray-300'>{token.symbol}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='p-4'>
                <div className='flex justify-between mb-2'>
                  <span className='text-gray-400'>Network</span>
                  <span>{token.network}</span>
                </div>
                <div className='flex justify-between mb-2'>
                  <span className='text-gray-400'>Supply</span>
                  <span>{token.supply}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Deployment</span>
                  <span className='text-purple-400'>{token.price}</span>
                </div>
              </div>

              <div className='border-t border-gray-700 p-4'>
                <button className='w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition-colors'>
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