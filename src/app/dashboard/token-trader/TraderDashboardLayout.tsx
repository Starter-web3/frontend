'use client';
import React, { useState, ReactNode } from 'react';
import TraderSidebar from './TraderSidebar';
import DashboardHeader from '../Header';
import Footer from '../../components/layout/Footer';
import { useWallet } from '../../../contexts/WalletContext';

const TraderDashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected } = useWallet();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className='flex flex-col md:flex-row min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-inter'>
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className='fixed inset-0 bg-black/50 z-40 md:hidden'
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
        <div
          className={`fixed md:relative inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition duration-200 ease-in-out z-50 md:z-0`}
        >
          <TraderSidebar />
        </div>

        <div className='flex-1 flex flex-col min-h-screen'>
          <DashboardHeader toggleSidebar={toggleSidebar} isConnected={isConnected} />
          <main className='flex-1 p-4 md:p-8 overflow-auto'>
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TraderDashboardLayout;