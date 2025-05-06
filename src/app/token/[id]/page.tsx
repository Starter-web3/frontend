"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sampleTokens, Token } from '@/src/app/listings/page' // Adjust import path based on your file structure

export default function TokenDetailPage({ params }: { params: { id: string } }) {
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Find the token with the matching ID
    const foundToken = sampleTokens.find(t => t.id === params.id);
    
    if (foundToken) {
      setToken(foundToken);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white flex flex-col items-center justify-center gap-4">
        <div className="text-2xl">Token not found</div>
        <button 
          onClick={() => router.push('/')}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-md transition-colors"
        >
          Back to Tokens
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to All Tokens
          </button>
        </div>

        {/* Token Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <div className="h-64 md:h-80 bg-gray-700 relative">
            <Image 
              src={token.backgroundUrl}
              alt={token.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
            />
          </div>
          
          <div className="absolute -bottom-12 left-8">
            <div className="bg-gray-700 p-2 rounded-xl border-4 border-gray-800">
              <div className="relative w-20 h-20 rounded-lg bg-white overflow-hidden">
                <Image 
                  src={token.logoUrl} 
                  alt={token.name} 
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Token Details */}
        <div className="pt-16 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold">{token.name}</h1>
              <p className="text-gray-400 flex items-center gap-2">
                {token.symbol} 
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span> 
                {token.type}
              </p>
            </div>
            <span className="bg-purple-600 px-4 py-2 rounded-md font-medium">
              {token.price}
            </span>
          </div>

          <p className="text-gray-300 mb-8 max-w-3xl">{token.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Token Information</h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm">Contract Address</span>
                  <span className="font-mono text-purple-400 break-all">{token.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network</span>
                  <span>{token.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Supply</span>
                  <span>{token.supply}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Creator</span>
                  <span>{token.creator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Creation Date</span>
                  <span>{token.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Features</h2>
              <ul className="space-y-3">
                {token.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 max-w-xl">
            <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors font-medium">
              Manage Token
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md transition-colors font-medium">
              View on Explorer
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}