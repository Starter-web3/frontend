'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { baseSepolia } from '../lib/wagmi-config'; // Adjust path as needed

interface WalletContextType {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  connect: (connectorId?: string) => void;
  disconnect: () => void;
  isConnecting: boolean;
  connectError: Error | null;
  chainId: number;
  baseSepolia: typeof baseSepolia;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, chainId } = useAccount();
  const {
    connect: wagmiConnect,
    connectors,
    error: connectError,
    isPending: isConnecting,
  } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();

  // EIP-6963 wallet detection
  const [availableWallets, setAvailableWallets] = useState<any[]>([]);

  useEffect(() => {
    // Function to handle wallet announcement events
    const handleWalletAnnouncement = (event: any) => {
      const { info, provider } = event.detail;
      setAvailableWallets((prev) => {
        if (!prev.some((wallet) => wallet.info.uuid === info.uuid)) {
          return [...prev, { info, provider }];
        }
        return prev;
      });
    };

    // Listen for wallet announcements
    window.addEventListener('eip6963:announceProvider', handleWalletAnnouncement);

    // Request wallets to announce themselves
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    // Cleanup
    return () => {
      window.removeEventListener('eip6963:announceProvider', handleWalletAnnouncement);
    };
  }, []);

  // Connect to a specific connector by ID, or the first available connector if not specified
  const connect = (connectorId?: string) => {
    let targetConnector;

    if (connectorId) {
      targetConnector = connectors.find((c) => c.id === connectorId);
    } else {
      targetConnector = connectors.find((c) => c.type !== 'injected' || c.id === 'metaMask');
    }

    if (targetConnector) {
      wagmiConnect({ connector: targetConnector });
    } else if (availableWallets.length > 0) {
      // Fall back to EIP-6963 detected wallets
      const wallet = availableWallets[0];
      // This is a simplified approach - you would need to adapt this to your wagmi setup
      console.log('Connecting to EIP-6963 wallet:', wallet.info.name);
      // Here you would integrate with your wagmi connector for the selected wallet
    }
  };

  const value = {
    address,
    isConnected,
    connect,
    disconnect: wagmiDisconnect,
    isConnecting,
    connectError,
    chainId: chainId || baseSepolia.id,
    baseSepolia,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
