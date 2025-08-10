// import { cookieStorage, createStorage } from "wagmi";
// import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
// import {
//   mainnet,
//   arbitrum,
//   baseSepolia,
//   liskSepolia,
// } from "@reown/appkit/networks";
// // Import the Storage type
// //import type { Config, Storage } from 'wagmi';

// export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// if (!projectId) {
//   throw new Error("Missing projectId in environment variables");
// }

// export const networks = [mainnet, arbitrum, baseSepolia, liskSepolia];

// // Create the storage without casting to Storage<Config>
// const storage = createStorage({
//   storage: cookieStorage,
// });

// // Now use the properly typed storage
// export const wagmiAdapter = new WagmiAdapter({
//   storage,
//   ssr: true,
//   networks,
//   projectId,
// });

// export const config = wagmiAdapter.wagmiConfig;

// import { cookieStorage, createStorage } from "wagmi";
// import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
// import { liskSepolia } from "@reown/appkit/networks";

// export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// if (!projectId) {
//   throw new Error("Missing projectId in environment variables");
// }

// // Only use Lisk Sepolia network
// export const networks = [liskSepolia];

// // Create the storage without casting to Storage
// const storage = createStorage({
//   storage: cookieStorage,
// });

// // Now use the properly typed storage
// export const wagmiAdapter = new WagmiAdapter({
//   storage,
//   ssr: true,
//   networks,
//   projectId,
// });

// export const config = wagmiAdapter.wagmiConfig;

import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
// Remove the lisk import and import your custom core config
import { coreSepolia } from "../lib/wagmi-config";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("Missing projectId in environment variables");
}

// Use Core Sepolia network instead of Lisk
export const networks = [coreSepolia];

// Create the storage without casting to Storage
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
