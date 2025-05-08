'use client';

import { Inter } from 'next/font/google';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from './components/layout/Header';
import { headers } from 'next/headers';
import ContextProvider from '../contexts/appKitContext';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang='en'>
      <body className={`${inter.className} ${poppinsFont.variable} min-h-screen bg-black`}>
        <Header />
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
