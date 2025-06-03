'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '../../../contexts/WalletContext';
import { useReadContract } from 'wagmi';
import { Abi } from 'viem';
import StrataForgeAdminABI from '../../../app/components/ABIs/StrataForgeAdminABI.json';

const ADMIN_CONTRACT_ADDRESS = '0x7e8541Ba29253C1722d366e3d08975B03f3Cc839' as const;
const adminABI = StrataForgeAdminABI as Abi;

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, text, active, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-3 ${
          active ? 'bg-[hsl(var(--foreground)/0.1)]' : 'hover:bg-[hsl(var(--foreground)/0.05)]'
        } transition-colors rounded-lg my-1 text-left`}
      >
        <div className='w-6 h-6 mr-3 flex items-center justify-center'>{icon}</div>
        <span className='font-inter font-normal text-base leading-[25px]'>{text}</span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 ${
        active ? 'bg-[hsl(var(--foreground)/0.1)]' : 'hover:bg-[hsl(var(--foreground)/0.05)]'
      } transition-colors rounded-lg my-1`}
    >
      <div className='w-6 h-6 mr-3 flex items-center justify-center'>{icon}</div>
      <span className='font-inter font-normal text-base leading-[24px]'>{text}</span>
    </Link>
  );
};

export default function DashboardSidebar() {
  const { address, isConnected, disconnect, connect } = useWallet();
  const pathname = usePathname();
  const currentPath = pathname || '/dashboard';
  const [subscription, setSubscription] = useState<{
    plan: string;
    tokensRemaining: number;
    expiry: number;
  } | null>(null);

  // Fetch subscription status
  const { data: subData } = useReadContract({
    address: ADMIN_CONTRACT_ADDRESS,
    abi: adminABI,
    functionName: 'getSubscription',
    args: [address],
    query: { enabled: isConnected && !!address, retry: 3, retryDelay: 1000 },
  });

  // Process subscription data
  useEffect(() => {
    if (!isConnected || !address || !subData) {
      setSubscription(null);
      return;
    }

    const planNames = ['Free', 'Classic', 'Pro', 'Premium'];
    const [tierIndex, expiry, tokensThisMonth] = subData as [bigint, bigint, bigint];
    const planName = planNames[Number(tierIndex)] || 'Free';
    const tokenLimits: { [key: string]: number } = {
      Free: 2,
      Classic: 5,
      Pro: 10,
      Premium: Infinity,
    };
    const maxTokens = tokenLimits[planName];
    const remainingTokens = Math.max(0, maxTokens - Number(tokensThisMonth));

    setSubscription({
      plan: planName,
      tokensRemaining: remainingTokens,
      expiry: Number(expiry) * 1000,
    });
  }, [isConnected, address, subData]);

  const handleDisconnect = () => {
    try {
      disconnect();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('walletconnect');
      }
      window.location.href = '/';
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connect error:', error);
    }
  };

  const handleAirdropClick = () => {
    if (!isConnected) {
      alert('Please connect your wallet to access airdrop features.');
      return;
    }
    if (subscription?.plan !== 'Premium') {
      alert('This feature is only available for Premium subscribers. Please upgrade your plan.');
      return;
    }
    // Navigate to the airdrop page
    window.location.href = '/dashboard/token-creator/airdrop-listing';
  };

  return (
    <aside className='w-64 h-auto min-h-[calc(100vh-64px)] transition-transform duration-300 ease-in-out'>
      <div className='h-full bg-[#201726] flex flex-col'>
        <div className='p-4 flex flex-col h-full'>
          <div className='flex items-center mb-8'>
            <div className='text-xl font-bold flex items-center'>
              <span className='text-[hsl(var(--primary-from))] mr-1'>Strata</span>
              <span className='text-[hsl(var(--foreground))]'>Forge</span>
            </div>
          </div>
          <div className='flex items-center gap-2 mb-8 px-4'>
            <div className='w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center'>
              <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </div>
            <div className='flex flex-col'>
              <span className='font-inter text-sm font-medium'>Token Creator</span>
              {isConnected ? (
                <div className='flex items-center gap-1'>
                  <div className='w-1.5 h-1.5 bg-green-400 rounded-full'></div>
                  <span className='font-mono text-xs text-gray-400'>Connected</span>
                </div>
              ) : (
                <div className='flex items-center gap-1'>
                  <div className='w-1.5 h-1.5 bg-red-400 rounded-full'></div>
                  <span className='font-mono text-xs text-gray-400'>Not Connected</span>
                </div>
              )}
            </div>
          </div>
          <nav className='space-y-1 flex-grow'>
            <SidebarLink
              href='/dashboard/token-creator'
              icon={
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                  />
                </svg>
              }
              text='Dashboard'
              active={currentPath === '/dashboard/token-creator'}
            />
            <SidebarLink
              href='/dashboard/token-creator/manage-subscription'
              icon={
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              }
              text='Manage Subscription'
              active={currentPath === '/dashboard/token-creator/manage-subscription'}
            />
            <SidebarLink
              href='/dashboard/token-creator/create-tokens'
              icon={
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                  />
                </svg>
              }
              text='Create Tokens'
              active={currentPath === '/dashboard/token-creator/create-tokens'}
            />
            <SidebarLink
              href='#'
              icon={
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7m-3-4v1a3 3 0 003 3h10a3 3 0 003-3V7'
                  />
                </svg>
              }
              text='Create Airdrop'
              active={currentPath.startsWith('/dashboard/token-creator/airdrop-listing')}
              onClick={handleAirdropClick}
            />
            <SidebarLink
              href='/dashboard/tokens'
              icon={
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 9V7a5 5 0 00-10 0v2a3 3 0 00-3 3v5a3 3 0 003 3h10a3 3 0 003-3v-5a3 3 0 00-3-3zM9 7a3 3 0 016 0v2H9V7z'
                  />
                </svg>
              }
              text='Token Wallet'
              active={currentPath === '/dashboard/tokens'}
            />
            <SidebarLink
              href='/profile'
              icon={
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              }
              text='My Profile'
              active={currentPath === '/profile'}
            />
          </nav>
          <div className='mt-auto pt-4 border-t border-gray-700/30'>
            <SidebarLink
              href='/support'
              icon={
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
                  />
                </svg>
              }
              text='Help & Support'
              active={currentPath === '/support'}
            />
            <SidebarLink
              href='#'
              icon={
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                  />
                </svg>
              }
              text={isConnected ? 'Log Out' : 'Connect Wallet'}
              active={false}
              onClick={isConnected ? handleDisconnect : handleConnect}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}