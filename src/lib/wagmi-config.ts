// // lib/wagmiConfig.ts
// import { createConfig, http } from 'wagmi';
// import { metaMask, coinbaseWallet } from '@wagmi/connectors';

// export const baseSepolia = {
//   id: 84532,
//   name: 'Base Sepolia',
//   network: 'base-sepolia',
//   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: [
//         `https://base-sepolia.g.alchemy.com/v2/${
//           process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'NwAXSce5onxA02_iNQWbwGPgPi5Wo2C3'
//         }`,
//         'https://sepolia.base.org',
//       ],
//     },
//     public: {
//       http: [
//         `https://base-sepolia.g.alchemy.com/v2/${
//           process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || 'NwAXSce5onxA02_iNQWbwGPgPi5Wo2C3'
//         }`,
//         'https://sepolia.base.org',
//       ],
//     },
//   },
//   blockExplorers: {
//     default: { name: 'BaseScan', url: 'https://base-sepolia.basescan.org' },
//   },
// };

// export const config = createConfig({
//   chains: [baseSepolia],
//   connectors: [metaMask(), coinbaseWallet({ appName: 'ProptyChain' })],
//   transports: {
//     [baseSepolia.id]: http(),
//   },
// });

// lib/wagmi-config.ts
import { createConfig, http } from "wagmi";
import { metaMask, coinbaseWallet } from "@wagmi/connectors";

export const liskSepolia = {
  id: 4202,
  name: "Lisk Sepolia Testnet",
  network: "lisk-sepolia",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia-api.lisk.com"],
    },
    public: {
      http: ["https://rpc.sepolia-api.lisk.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Lisk Sepolia Explorer",
      url: "https://sepolia-blockscout.lisk.com",
    },
  },
};

export const config = createConfig({
  chains: [liskSepolia],
  connectors: [metaMask(), coinbaseWallet({ appName: "ProptyChain" })],
  transports: {
    [liskSepolia.id]: http("https://rpc.sepolia-api.lisk.com"),
  },
});
