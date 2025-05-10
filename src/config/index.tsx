import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum, baseSepolia } from '@reown/appkit/networks';
// Import the Storage type
//import type { Config, Storage } from 'wagmi';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Missing projectId in environment variables');
}

export const networks = [mainnet, arbitrum, baseSepolia];

// Create the storage without casting to Storage<Config>
const storage = createStorage({
  storage: cookieStorage,
});

// Now use the properly typed storage
export const wagmiAdapter = new WagmiAdapter({
  storage,
  ssr: true,
  networks,
  projectId,
});

export const config = wagmiAdapter.wagmiConfig;
