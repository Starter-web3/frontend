'use client';

import { ReactNode } from 'react';
import { WagmiConfig } from 'wagmi';
import { config } from './lib/wagmi-config';

import { WalletProvider } from './contexts/WalletContext';
interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiConfig config={config}>
      <WalletProvider>{children}</WalletProvider>
    </WagmiConfig>
  );
}
