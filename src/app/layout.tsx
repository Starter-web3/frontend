'use client';

import { Inter } from 'next/font/google';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from './components/layout/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

import { WalletProvider } from '../contexts/WalletContext'; //
import { config } from '../lib/wagmi-config';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

const poppinsFont = Poppins({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const metadata = {
  title: 'ProptyChain - Blockchain-Secured Real Estate in Nigeria',
  description:
    'Buy, sell, rent and lease properties in Nigeria with blockchain security and smart contracts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang='en'>
      <body className={`${inter.className} ${poppinsFont.variable} min-h-screen bg-black`}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <WalletProvider>
              <Header />
              {children}
            </WalletProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}