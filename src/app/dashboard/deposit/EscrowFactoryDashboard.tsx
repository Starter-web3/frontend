// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
// import { isAddress, parseEventLogs } from 'viem';
// import { baseSepolia } from '../../../lib/wagmi-config';
// import { useWallet } from '../../../contexts/WalletContext';
// import { ExternalLink, AlertTriangle, CheckCircle, Shield } from 'lucide-react';

// // IMPORTANT: make sure to Update with the correct factory address
// const FACTORY_ADDRESS = '0xf8cEb019C9e68C00c5Edf7AcFD14d917e77db5B2' as `0x${string}`;

// const ESCROW_FACTORY_ABI = [
//   {
//     inputs: [],
//     name: 'createEscrow',
//     outputs: [{ internalType: 'address', name: '', type: 'address' }],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'bool', name: '_paused', type: 'bool' }],
//     name: 'setPaused',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
//     name: 'getSeekerEscrows',
//     outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'isPaused',
//     outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
//       { indexed: false, internalType: 'address', name: 'escrow', type: 'address' },
//     ],
//     name: 'EscrowCreated',
//     type: 'event',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: false, internalType: 'bool', name: 'paused', type: 'bool' },
//       { indexed: true, internalType: 'address', name: 'admin', type: 'address' },
//     ],
//     name: 'FactoryPaused',
//     type: 'event',
//   },
// ];

// interface FormData {
//   // No form inputs needed for createEscrow, but kept for potential future use
// }

// interface EscrowInfo {
//   address: string;
//   createdAt: number;
// }

// const EscrowFactoryDashboard = () => {
//   const router = useRouter();
//   const { address: account, isConnected } = useWallet();
//   const { writeContractAsync, data: txHash, isPending, error: writeError } = useWriteContract();

//   const [formData, setFormData] = useState<FormData>({});
//   const [error, setError] = useState<string>('');
//   const [successMessage, setSuccessMessage] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [newEscrowAddress, setNewEscrowAddress] = useState<`0x${string}` | null>(null);
//   const [userEscrows, setUserEscrows] = useState<EscrowInfo[]>([]);
//   const [isFactoryPaused, setIsFactoryPaused] = useState<boolean>(false);

//   // Check if factory is paused
//   const { data: isPaused, error: pauseError } = useReadContract({
//     address: FACTORY_ADDRESS,
//     abi: ESCROW_FACTORY_ABI,
//     functionName: 'isPaused',
//     chainId: baseSepolia.id,
//     query: {
//       enabled: isConnected,
//       retry: true,
//       retryDelay: 1000,
//     },
//   });

//   // Fetch user's escrows
//   const {
//     data: fetchedEscrows,
//     error: readError,
//     refetch: refetchEscrows,
//   } = useReadContract({
//     address: FACTORY_ADDRESS,
//     abi: ESCROW_FACTORY_ABI,
//     functionName: 'getSeekerEscrows',
//     args: [account as `0x${string}`],
//     chainId: baseSepolia.id,
//     query: {
//       enabled: !!account && isConnected,
//       retry: true,
//       retryDelay: 1000,
//     },
//   });

//   // Wait for transaction receipt to get EscrowCreated event
//   const { data: receipt, error: receiptError } = useWaitForTransactionReceipt({
//     hash: txHash,
//     chainId: baseSepolia.id,
//     query: {
//       enabled: !!txHash,
//     },
//   });

//   // Update UI when fetching factory status
//   useEffect(() => {
//     if (isPaused !== undefined) {
//       setIsFactoryPaused(isPaused as boolean);
//     }

//     if (pauseError) {
//       console.error('Error fetching factory status:', pauseError);
//       setError('Unable to determine if factory is active. Please check network connection.');
//     }
//   }, [isPaused, pauseError]);

//   // Update UI when fetching user escrows
//   useEffect(() => {
//     if (fetchedEscrows && Array.isArray(fetchedEscrows)) {
//       const escrowsWithTime: EscrowInfo[] = (fetchedEscrows as string[]).map((address, index) => ({
//         address,
//         createdAt: Date.now() - index * 86400000,
//       }));

//       escrowsWithTime.sort((a, b) => b.createdAt - a.createdAt);
//       setUserEscrows(escrowsWithTime);
//     }

//     if (readError) {
//       console.error('Error fetching user escrows:', readError);
//       setError('Failed to fetch your escrows. Please check network connection.');
//     }
//   }, [fetchedEscrows, readError]);

//   // Process transaction receipt to extract EscrowCreated event
//   useEffect(() => {
//     if (!receipt || !account || !txHash) return;

//     try {
//       const logs = parseEventLogs({
//         abi: ESCROW_FACTORY_ABI,
//         eventName: 'EscrowCreated',
//         logs: receipt.logs,
//       });

//       console.log('Parsed EscrowCreated logs:', logs);

//       const escrowLog = logs.find(
//         (log) =>
//           log.args.owner?.toLowerCase() === account.toLowerCase() &&
//           isAddress(log.args.escrow as string),
//       );

//       if (escrowLog && escrowLog.args.escrow) {
//         console.log('EscrowCreated event found:', escrowLog.args.escrow);
//         setNewEscrowAddress(escrowLog.args.escrow as `0x${string}`);
//       } else {
//         console.error('No valid EscrowCreated event found in receipt');
//         setError('Failed to detect new escrow address from transaction');
//         setLoading(false);
//       }
//     } catch (err: any) {
//       console.error('Error parsing transaction receipt:', err);
//       setError('Failed to process escrow creation: ' + err.message);
//       setLoading(false);
//     }
//   }, [receipt, account, txHash]);

//   // Handle receipt errors
//   useEffect(() => {
//     if (receiptError) {
//       console.error('Error fetching transaction receipt:', receiptError);
//       setError('Failed to confirm escrow creation. Please check network connection.');
//       setLoading(false);
//     }
//   }, [receiptError]);

//   // Handle new escrow address confirmation and navigation
//   useEffect(() => {
//     if (!newEscrowAddress || !account) return;

//     const confirmEscrow = async () => {
//       console.log('Confirming escrow for address:', newEscrowAddress);
//       setLoading(true);
//       try {
//         setSuccessMessage(`Escrow created at ${newEscrowAddress}`);
//         await refetchEscrows();
//         setFormData({});

//         // FIXED: Changed navigation route to match app structure
//         // Added shallow route to ensure proper client-side navigation
//         console.log('Navigating to:', `/dashboard?address=${newEscrowAddress}`);

//         // Let's try two approaches - first using router.push
//         router.push(`/dashboard?address=${newEscrowAddress}`, { scroll: false });

//         // As a backup, we'll also update the URL directly after a short delay
//         setTimeout(() => {
//           if (window.location.href.indexOf(`address=${newEscrowAddress}`) === -1) {
//             console.log('Fallback navigation method triggered');
//             window.history.pushState({}, '', `/dashboard?address=${newEscrowAddress}`);
//             // Dispatch a popstate event to ensure URL change is detected
//             window.dispatchEvent(new Event('popstate'));
//           }
//         }, 500);
//       } catch (err: any) {
//         console.error('Error confirming escrow:', err);
//         setError(err.message || 'Failed to confirm escrow creation');
//       } finally {
//         setLoading(false);
//         setNewEscrowAddress(null);
//       }
//     };

//     confirmEscrow();
//   }, [newEscrowAddress, account, router, refetchEscrows]);

//   // Handle write errors
//   useEffect(() => {
//     if (writeError) {
//       console.error('Write contract error:', writeError);
//       setLoading(false);
//       setError(writeError.message || 'Failed to create escrow');
//     }
//   }, [writeError]);

//   // Clear success message after 5 seconds
//   useEffect(() => {
//     if (successMessage) {
//       const timer = setTimeout(() => {
//         setSuccessMessage('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage]);

//   const handleCreateEscrow = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccessMessage('');
//     setNewEscrowAddress(null);

//     try {
//       if (!account) {
//         setError('Wallet not connected');
//         setLoading(false);
//         return;
//       }

//       if (isFactoryPaused) {
//         setError('Factory is currently paused by admin');
//         setLoading(false);
//         return;
//       }

//       const tx = await writeContractAsync({
//         address: FACTORY_ADDRESS,
//         abi: ESCROW_FACTORY_ABI,
//         functionName: 'createEscrow',
//         args: [],
//       });

//       console.log('Transaction submitted with hash:', tx);
//       setSuccessMessage('Escrow creation transaction submitted - waiting for confirmation');
//     } catch (err: any) {
//       console.error('Error submitting transaction:', err);
//       setError(err.message || 'Failed to create escrow');
//       setLoading(false);
//     }
//   };

//   // Format timestamp to readable date
//   const formatDate = (timestamp: number) => {
//     return new Date(timestamp).toLocaleDateString(undefined, {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   // Render recent escrows
//   const renderUserEscrows = () => {
//     if (!userEscrows || userEscrows.length === 0) {
//       return (
//         <div className='text-center py-6'>
//           <p className='text-white/50'>
//             No escrows found. Create your first escrow to get started.
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div className='grid grid-cols-1 gap-4'>
//         {userEscrows.map((escrow, index) => (
//           <div
//             key={index}
//             className='p-4 bg-[#2D1E3E] rounded-lg border border-white/10 flex justify-between items-center hover:bg-[#3D2E4E] transition'
//           >
//             <div>
//               <div className='flex items-center'>
//                 <Shield className='w-4 h-4 text-teal-400 mr-2' />
//                 <p className='text-white'>
//                   Escrow: {escrow.address.slice(0, 6)}...{escrow.address.slice(-4)}
//                 </p>
//               </div>
//               <p className='text-xs text-white/50 mt-1'>Created: {formatDate(escrow.createdAt)}</p>
//             </div>
//             <div className='flex items-center space-x-3'>
//               <a
//                 href={`${baseSepolia.blockExplorers.default.url}/address/${escrow.address}`}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 className='text-white/50 hover:text-white'
//                 title='View on BaseScan'
//               >
//                 <ExternalLink className='w-4 h-4' />
//               </a>
//               <button
//                 onClick={() => {
//                   console.log('Navigating to escrow from list:', escrow.address);
//                   router.push(`/dashboard?address=${escrow.address}`);
//                 }}
//                 className='px-3 py-1 text-sm bg-gradient-to-r from-teal-500/20 to-purple-500/20 text-teal-300 rounded-lg hover:from-teal-500/30 hover:to-purple-500/30 transition'
//               >
//                 Manage
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className='max-w-6xl mx-auto px-4 py-8 font-inter text-white'>
//       <h1 className='text-2xl font-semibold mb-8'>Escrow Factory Dashboard</h1>

//       {error && (
//         <div className='bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6'>
//           <div className='flex items-start'>
//             <AlertTriangle className='h-5 w-5 text-red-400 mr-2 mt-0.5' />
//             <p className='text-red-300'>{error}</p>
//           </div>
//         </div>
//       )}

//       {successMessage && (
//         <div className='bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6'>
//           <div className='flex items-start'>
//             <CheckCircle className='h-5 w-5 text-green-400 mr-2 mt-0.5' />
//             <p className='text-green-300'>{successMessage}</p>
//           </div>
//         </div>
//       )}

//       {!isConnected ? (
//         <div className='text-center py-12 bg-[#1D0E2E] rounded-lg'>
//           <p className='text-white/70 mb-4'>Connect your wallet to create escrows</p>
//         </div>
//       ) : (
//         <div className='space-y-8'>
//           <div className='bg-[#1D0E2E] rounded-lg p-6 border border-white/10'>
//             <h2 className='text-xl font-medium mb-6'>Create Escrow</h2>
//             <form onSubmit={handleCreateEscrow} className='space-y-4'>
//               <div className='bg-[#2D1E3E]/50 p-4 rounded-lg mb-4'>
//                 <h3 className='font-medium mb-2'>About Escrow Contracts</h3>
//                 <p className='text-white/70 text-sm'>
//                   Escrow contracts facilitate secure property transactions by holding funds until
//                   all parties agree. Create an escrow contract to start a new property purchase
//                   transaction.
//                 </p>
//               </div>

//               {isFactoryPaused && (
//                 <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4'>
//                   <div className='flex items-start'>
//                     <AlertTriangle className='h-5 w-5 text-yellow-400 mr-2 mt-0.5' />
//                     <p className='text-yellow-300 text-sm'>
//                       <strong>Notice:</strong> The escrow factory is currently paused by admin. You
//                       cannot create new escrows at this time.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               <button
//                 type='submit'
//                 disabled={loading || isPending || isFactoryPaused}
//                 className='w-full py-4 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl'
//               >
//                 {loading || isPending ? (
//                   <span className='flex items-center justify-center'>
//                     <span className='inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2'></span>
//                     Creating...
//                   </span>
//                 ) : isFactoryPaused ? (
//                   'Factory Paused'
//                 ) : (
//                   'Create Escrow'
//                 )}
//               </button>
//             </form>
//           </div>

//           <div className='bg-[#1D0E2E] rounded-lg p-6 border border-white/10'>
//             <div className='flex justify-between items-center mb-6'>
//               <h2 className='text-xl font-medium'>Your Escrows</h2>
//               {userEscrows.length > 0 && (
//                 <span className='px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-full'>
//                   {userEscrows.length} total
//                 </span>
//               )}
//             </div>
//             {renderUserEscrows()}
//           </div>

//           <div className='bg-[#1D0E2E] rounded-lg p-6 border border-white/10'>
//             <h2 className='text-xl font-medium mb-4'>How Escrow Works</h2>
//             <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
//               <div className='p-4 bg-[#2D1E3E]/50 rounded-lg'>
//                 <div className='bg-purple-500/20 text-purple-300 w-8 h-8 rounded-full flex items-center justify-center mb-3'>
//                   1
//                 </div>
//                 <h3 className='text-lg font-medium mb-2'>Create Escrow</h3>
//                 <p className='text-sm text-white/70'>
//                   Create an escrow contract to begin a property transaction. The escrow will safely
//                   hold your funds.
//                 </p>
//               </div>
//               <div className='p-4 bg-[#2D1E3E]/50 rounded-lg'>
//                 <div className='bg-teal-500/20 text-teal-300 w-8 h-8 rounded-full flex items-center justify-center mb-3'>
//                   2
//                 </div>
//                 <h3 className='text-lg font-medium mb-2'>Deposit Funds</h3>
//                 <p className='text-sm text-white/70'>
//                   Deposit ETH to your escrow contract to be used for property purchases.
//                 </p>
//               </div>
//               <div className='p-4 bg-[#2D1E3E]/50 rounded-lg'>
//                 <div className='bg-blue-500/20 text-blue-300 w-8 h-8 rounded-full flex items-center justify-center mb-3'>
//                   3
//                 </div>
//                 <h3 className='text-lg font-medium mb-2'>Complete Transaction</h3>
//                 <p className='text-sm text-white/70'>
//                   All parties (buyer, seller, verifier) must agree before funds are released and the
//                   NFT is transferred.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EscrowFactoryDashboard;
