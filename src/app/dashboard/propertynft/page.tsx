'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../DashboardLayout';
import PropertyNFTDashboard from './PropertyNFTDashboard';
import PropertyNFTFactoryDashboard from './PropertyNFTFactoryDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/ui/dashboard/tab';
import { Building, Home, Wallet, LogOut, ExternalLink } from 'lucide-react';
import { useWallet } from '../../../contexts/WalletContext'; // Adjust path as needed

// Simple Connect Wallet Button using our context
function ConnectWalletButton() {
  const { connect, isConnecting, connectError } = useWallet();

  return (
    <div className='relative'>
      <button
        onClick={() => connect()}
        disabled={isConnecting}
        className='flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition disabled:opacity-50'
      >
        <Wallet className='w-4 h-4' />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {connectError && (
        <div className='absolute top-full mt-2 right-0 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm max-w-xs'>
          {connectError.message}
        </div>
      )}
    </div>
  );
}

export default function PropertyDashboardPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('factory');
  const { address, isConnected, disconnect, baseSepolia } = useWallet();

  // Auto-switch to property tab if address is present in URL
  useEffect(() => {
    const propertyAddress = searchParams.get('address');
    if (propertyAddress) {
      setActiveTab('property');
    }
  }, [searchParams]);

  return (
    <DashboardLayout>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-semibold text-white font-poppins'>
              Property NFT Management
            </h1>
            <p className='text-white/70 mt-2'>
              Create, manage, and track your real estate properties on the blockchain
            </p>
          </div>

          {/* Wallet Connection */}
          <div>
            {isConnected ? (
              <div className='flex items-center space-x-4'>
                <div className='bg-[#2D1E3E] px-4 py-2 rounded-lg border border-white/10'>
                  <div className='flex items-center gap-2'>
                    <span className='inline-block w-2 h-2 bg-green-400 rounded-full'></span>
                    <p className='text-white/70 text-sm'>Connected to {baseSepolia.name}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <p className='text-white font-medium'>
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                    </p>
                    {address && (
                      <a
                        href={`${baseSepolia.blockExplorers.default.url}/address/${address}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-teal-400 hover:text-teal-300 transition'
                        title='View on BaseScan'
                      >
                        <ExternalLink className='w-3 h-3' />
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => disconnect()}
                  className='p-2 rounded-lg bg-[#2D1E3E] border border-white/10 text-white/70 hover:text-white hover:bg-[#3D2E4E] transition'
                  title='Disconnect wallet'
                >
                  <LogOut className='w-5 h-5' />
                </button>
              </div>
            ) : (
              <ConnectWalletButton />
            )}
          </div>
        </div>

        <Tabs
          defaultValue='factory'
          value={activeTab}
          onValueChange={setActiveTab}
          className='w-full'
          key={searchParams.get('address') || 'factory'}
        >
          <div className='flex justify-center mb-6'>
            <TabsList className='bg-[#1D0E2E] p-1 rounded-lg'>
              <TabsTrigger
                value='factory'
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${
                  activeTab === 'factory'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Building className='w-4 h-4' />
                <span>Property Factory</span>
              </TabsTrigger>
              <TabsTrigger
                value='property'
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${
                  activeTab === 'property'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Home className='w-4 h-4' />
                <span>Property Details</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='factory' className='mt-0'>
            <PropertyNFTFactoryDashboard />
          </TabsContent>

          <TabsContent value='property' className='mt-0'>
            <PropertyNFTDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
