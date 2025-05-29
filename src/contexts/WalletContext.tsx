'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useDisconnect, useSignMessage } from 'wagmi';
import { baseSepolia } from '../lib/wagmi-config';
import { useAuth } from './AuthContext';
import { usePathname } from 'next/navigation';

interface WalletContextType {
  address: `0x${string}` | undefined;
  caipAddress: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isAuthenticated: boolean;
  connect: () => void;
  disconnect: () => void;
  connectError: Error | null;
  baseSepolia: typeof baseSepolia;
  signMessage: (message: string) => Promise<`0x${string}` | undefined>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// localStorage key for wallet address
const WALLET_ADDRESS_KEY = 'wallet_address';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // Use AppKit hook for more reliable account info
  const { address, caipAddress, isConnected } = useAppKitAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { login } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  // Effect to handle wallet connection/disconnection and auth check
  useEffect(() => {
    const handleWalletConnection = async () => {
      console.log('Wallet state changed:', { address, caipAddress, isConnected });
      
      if (address && isConnected) {
        // Store wallet address when connected
        localStorage.setItem(WALLET_ADDRESS_KEY, address);
        console.log('Stored wallet address:', address);

        // Don't attempt login on registration or email verification pages
        if (!pathname?.includes('registration') && !pathname?.includes('verification')) {
          try {
            // Try to login with the connected wallet address
            const response = await login({ walletAddress: address });
            
            // If we get here, login was successful (user is registered)
            if (response?.data?.token) {
              setIsAuthenticated(true);
              console.log('Login successful, user is registered');
            }
          } catch (error: any) {
            console.log('Login failed:', error?.response?.data || error);
            setIsAuthenticated(false);
            // Clean up any existing auth data
            localStorage.removeItem('token');
            localStorage.removeItem('role');
          }
        }
      } else if (!isConnected) {
        // Remove wallet address and auth data when disconnected
        localStorage.removeItem(WALLET_ADDRESS_KEY);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        console.log('Wallet disconnected, cleared auth data');
      }
    };

    handleWalletConnection();
  }, [address, isConnected, login, pathname]);

  // Function to connect wallet using AppKit
  const connect = async () => {
    setIsConnecting(true);
    setConnectError(null);

    try {
      // This calls the appkit connect method via custom element
      const appkitButton = document.querySelector('appkit-button');
      if (appkitButton) {
        // Trigger click on the appkit-button element
        (appkitButton as HTMLElement).click();
      } else {
        throw new Error('AppKit button not found in the DOM');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setConnectError(error instanceof Error ? error : new Error('Failed to connect wallet'));
      setIsAuthenticated(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to disconnect wallet
  const disconnect = () => {
    wagmiDisconnect();
    setIsAuthenticated(false);
    localStorage.removeItem(WALLET_ADDRESS_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  // Function to sign a message
  const signMessage = async (message: string): Promise<`0x${string}` | undefined> => {
    try {
      return await signMessageAsync({ message });
    } catch (error) {
      console.error('Error signing message:', error);
      return undefined;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address: address as `0x${string}` | undefined,
        caipAddress,
        isConnected,
        isConnecting,
        isAuthenticated,
        connect,
        disconnect,
        connectError,
        baseSepolia,
        signMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Utility function to get wallet address from localStorage
export function getStoredWalletAddress(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(WALLET_ADDRESS_KEY);
}