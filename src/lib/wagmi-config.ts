// lib/wagmi-config.ts
import { createConfig, http } from "wagmi";
import { metaMask, coinbaseWallet } from "@wagmi/connectors";

export const baseMainnet = {
  id: 8453, // Base Mainnet chain ID
  name: "Base",
  network: "base",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org"],
    },
    public: {
      http: ["https://mainnet.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "BaseScan",
      url: "https://basescan.org",
    },
  },
  testnet: false,
};

export const config = createConfig({
  chains: [baseMainnet],
  connectors: [metaMask(), coinbaseWallet({ appName: "Zephyra" })],
  transports: {
    [baseMainnet.id]: http("https://mainnet.base.org"),
  },
});
