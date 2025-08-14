'use client';
import React, { useState, ReactNode } from 'react';
import TraderSidebar from './TraderSidebar';
import DashboardHeader from '../Header';
import Footer from '../../components/layout/Footer';
import { useWallet } from '../../../contexts/WalletContext';

const TraderDashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected } = useWallet();

  return (
    <div className='flex h-screen overflow-hidden bg-black/90 text-[hsl(var(--foreground))] font-inter'>
      {sidebarOpen && (
        <div className='fixed inset-0 bg-black/50 z-40 md:hidden' onClick={() => setSidebarOpen(false)}></div>
      )}
      <div className={`fixed inset-y-0 left-0 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-50 md:z-10`}>
        <TraderSidebar />
      </div>
      <div className='flex-1 flex flex-col h-screen md:ml-64'>
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isConnected={isConnected} />
        <div className='flex-1 overflow-y-auto'>
          <main className='p-4 md:p-8'>
            {!isConnected ? (
              <div className='text-center p-8'>
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Wallet Required</h3>
                  <p className="text-gray-400 mb-6">Please connect your wallet to access the trading dashboard</p>
                  <button 
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition-colors"
                    onClick={() => document.querySelector('appkit-button')?.click()}
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            ) : (
              children
            )}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default TraderDashboardLayout;