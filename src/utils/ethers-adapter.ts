// import { ethers } from 'ethers';

// /**
//  * Converts an AppKit provider to an ethers.js signer
//  * @param {Object} params - The parameters
//  * @param {any} params.provider - The AppKit provider
//  * @returns {Promise<ethers.JsonRpcSigner>} - The ethers.js signer
//  */
// export async function getEthersSigner({
//   provider,
// }: {
//   provider: any;
// }): Promise<ethers.JsonRpcSigner> {
//   // Create an Ethers provider from the AppKit provider
//   const ethersProvider = new ethers.BrowserProvider(provider);

//   // Get the signer from the provider
//   return ethersProvider.getSigner();
// }

// /**
//  * Creates a read-only ethers provider for a specific network
//  * @param {string} rpcUrl - The RPC URL for the network
//  * @returns {ethers.JsonRpcProvider} - A read-only provider
//  */
// export function createReadOnlyProvider(rpcUrl: string): ethers.JsonRpcProvider {
//   return new ethers.JsonRpcProvider(rpcUrl);
// }

// /**
//  * Gets a contract instance with the connected wallet
//  * @param {Object} params - The parameters
// //  * @param {string} params.address - The contract address
//  * @param {any} params.abi - The contract ABI
//  * @param {ethers.JsonRpcSigner} params.signer - The ethers signer
//  * @returns {ethers.Contract} - The contract instance
//  */
// export function getContract({
//   address,
//   abi,
//   signer,
// }: {
//   address: string;
//   abi: any;
//   signer: ethers.JsonRpcSigner;
// }): ethers.Contract {
//   return new ethers.Contract(address, abi, signer);
// }

// /**
//  * Formats an Ethereum address for display (e.g., 0x1234...5678)
//  * @param {string} address - The full address
//  * @param {number} prefixLength - Number of characters to show at the beginning
//  * @param {number} suffixLength - Number of characters to show at the end
//  * @returns {string} - The formatted address
//  */
// export function formatAddress(
//   address: string,
//   prefixLength: number = 6,
//   suffixLength: number = 4,
// ): string {
//   if (!address) return '';
//   return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
// }
