'use client';

import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { baseSepolia, lisk, liskSepolia, sepolia } from '@reown/appkit/networks';

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not defined in environment variables');
}

// 2. Create a metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/'],
};

// 3. Create the AppKit instance
export const inintAppkit = () =>
  createAppKit({
    adapters: [new EthersAdapter()],
    metadata: metadata,
    networks: [lisk, liskSepolia, sepolia, baseSepolia],
    projectId,
    features: {
      analytics: true,
    },
    allowUnsupportedChain: true,
    allWallets: 'SHOW',
  });

// Initialize AppKit
inintAppkit();