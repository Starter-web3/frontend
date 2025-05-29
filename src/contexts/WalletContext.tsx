'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { useDisconnect, useSignMessage } from 'wagmi';
import { baseSepolia } from '../lib/wagmi-config';
import { useAuth } from './AuthContext';
import { usePathname } from 'next/navigation';

// Define the type for the user
type User = {
  id: string;
  walletAddress?: string;
  name?: string;
  email?: string;
  role?: string;
  verificationStatus?: string;
  phoneNumber?: string;
  createdAt?: string;
};

interface AuthData {
  token: string;
  user: User;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

type LoginResponse = ApiResponse<AuthData>;

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

  // Check for existing token and wallet connection on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const storedWalletAddress = localStorage.getItem(WALLET_ADDRESS_KEY);
      
      console.log('Checking auth status:', {
        token,
        role,
        storedWalletAddress,
        currentAddress: address,
        isConnected
      });

      if (token && role && storedWalletAddress && address && isConnected) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, [address, isConnected]);

  // Effect to handle wallet connection/disconnection and auth check
  useEffect(() => {
    const handleWalletConnection = async () => {
      try {
        console.log('Wallet state changed:', { address, caipAddress, isConnected });
        
        if (address && isConnected) {
          localStorage.setItem(WALLET_ADDRESS_KEY, address);
          console.log('Stored wallet address:', address);

          // Only attempt login if we're not on registration or verification pages
          // and we don't already have a valid token
          const token = localStorage.getItem('token');
          const role = localStorage.getItem('role');

          if (!pathname?.includes('registration') && !pathname?.includes('verification') && (!token || !role)) {
            try {
              const response = await login({ walletAddress: address });
              console.log('Login response:', response);
              console.log('Response structure:', {
                success: response.success,
                message: response.message,
                hasData: response.data !== undefined,
                fullStructure: JSON.stringify(response, null, 2)
              });
              
              if (response.success && response.data?.token) {
                setIsAuthenticated(true);
                console.log('Login successful, user is registered');
              } else {
                console.log('Login response missing token:', response);
                setIsAuthenticated(false);
              }
            } catch (error: unknown) {
              const err = error as { response?: { data?: unknown }; message?: string };
              console.log('Login failed:', err?.response?.data || err);
              setIsAuthenticated(false);
              localStorage.removeItem('token');
              localStorage.removeItem('role');
            }
          }
        } else if (!isConnected) {
          localStorage.removeItem(WALLET_ADDRESS_KEY);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setIsAuthenticated(false);
          console.log('Wallet disconnected, cleared auth data');
        }
      } catch (error) {
        console.error('Error in wallet connection handler:', error);
      }
    };

    handleWalletConnection();
  }, [address, isConnected, login, pathname, caipAddress]);

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
        console.log('AppKit button clicked');
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
    try {
      wagmiDisconnect();
      setIsAuthenticated(false);
      localStorage.removeItem(WALLET_ADDRESS_KEY);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      console.log('Wallet disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
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