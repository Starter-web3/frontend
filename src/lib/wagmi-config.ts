// lib/wagmi-config.ts
import { createConfig, http } from "wagmi";
import { metaMask, coinbaseWallet } from "@wagmi/connectors";

export const coreTestnet2 = {
  id: 1114, // Core Testnet 2 chain ID
  name: "Core Testnet 2",
  network: "core-testnet2",
  nativeCurrency: {
    name: "Core",
    symbol: "CORE", // Currency symbol as specified
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.test2.btcs.network"],
    },
    public: {
      http: ["https://rpc.test2.btcs.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Core Testnet 2 Explorer",
      url: "https://scan.test2.btcs.network",
    },
  },
  testnet: true,
};

export const config = createConfig({
  chains: [coreTestnet2],
  connectors: [metaMask(), coinbaseWallet({ appName: "ProptyChain" })],
  transports: {
    [coreTestnet2.id]: http("https://rpc.test2.btcs.network"),
  },
});
