
import { cookieStorage, createStorage } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
// Remove the lisk import and import your custom core config
import { coreTestnet2 } from "../lib/wagmi-config";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("Missing projectId in environment variables");
}

// Use Core Testnet 2 network
export const networks = [coreTestnet2];

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
