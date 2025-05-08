import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Missing projectId in environment variables');
}

export const networks = [mainnet, arbitrum];

// Fix the storage type issue
export const wagmiAdapter = new WagmiAdapter({
  // Use type assertion to bypass the type mismatch
  storage: createStorage({
    storage: cookieStorage,
  }) as any,
  ssr: true,
  networks,
  projectId,
});

export const config = wagmiAdapter.wagmiConfig;
