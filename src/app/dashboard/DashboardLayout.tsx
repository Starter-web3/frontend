'use client';
import React, { useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import Footer from '../components/layout/Footer';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected, isAuthenticated } = useWallet();
  const { user } = useAuth();
  const router = useRouter();

  // Protect dashboard route
  useEffect(() => {
    if (!isConnected || !isAuthenticated || !user) {
      router.push('/');
    }
  }, [isConnected, isAuthenticated, user, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // If not authenticated, render nothing while redirecting
  if (!isConnected || !isAuthenticated || !user) {
    return null;
  }

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
          <DashboardSidebar />
        </div>

        <div className='flex-1 flex flex-col min-h-screen'>
          <DashboardHeader toggleSidebar={toggleSidebar} isConnected={isConnected} />
          <main className='flex-1 p-4 md:p-8 overflow-auto'>
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
