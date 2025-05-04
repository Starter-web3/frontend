// lib/wagmiConfig.ts
import { createConfig, http } from 'wagmi';
import { metaMask, coinbaseWallet } from '@wagmi/connectors';

export const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        `https://base-sepolia.g.alchemy.com/v2/${
          process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'NwAXSce5onxA02_iNQWbwGPgPi5Wo2C3'
        }`,
        'https://sepolia.base.org',
      ],
    },
    public: {
      http: [
        `https://base-sepolia.g.alchemy.com/v2/${
          process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'NwAXSce5onxA02_iNQWbwGPgPi5Wo2C3'
        }`,
        'https://sepolia.base.org',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://base-sepolia.basescan.org' },
  },
};

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [metaMask(), coinbaseWallet({ appName: 'ProptyChain' })],
  transports: {
    [baseSepolia.id]: http(),
  },
});
