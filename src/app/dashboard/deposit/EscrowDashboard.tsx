// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useWriteContract, useReadContract, useWatchContractEvent } from 'wagmi';
// import { isAddress, parseEther, formatEther } from 'viem';
// import { baseSepolia } from '../../../lib/wagmi-config';
// import { useWallet } from '../../../contexts/WalletContext';
// import { AlertDescription, AlertTitle, Alert } from '@/src/ui/dashboard/AlertComponent';
// import { ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';

// const ESCROW_ABI = [
//   {
//     inputs: [],
//     name: 'deposit',
//     outputs: [],
//     stateMutability: 'payable',
//     type: 'function',
//   },
//   {
//     inputs: [
//       { internalType: 'address', name: '_propertyNFT', type: 'address' },
//       { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
//       { internalType: 'uint256', name: '_amount', type: 'uint256' },
//     ],
//     name: 'agreeToTransaction',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'cancelTransaction',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'withdraw',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'getTransactionDetails',
//     outputs: [
//       { internalType: 'address', name: 'transactionOwner', type: 'address' },
//       { internalType: 'address', name: 'transactionPropertyOwner', type: 'address' },
//       { internalType: 'address', name: 'transactionPropertyNFT', type: 'address' },
//       { internalType: 'uint256', name: 'transactionTokenId', type: 'uint256' },
//       { internalType: 'uint256', name: 'transactionAmount', type: 'uint256' },
//       { internalType: 'bool', name: 'transactionOwnerAgreed', type: 'bool' },
//       { internalType: 'bool', name: 'transactionPropertyOwnerAgreed', type: 'bool' },
//       { internalType: 'bool', name: 'transactionVerifierAgreed', type: 'bool' },
//       { internalType: 'address', name: 'transactionVerifier', type: 'address' },
//       { internalType: 'bool', name: 'isPropertySelected', type: 'bool' },
//       { internalType: 'uint256', name: 'transactionAgreementExpiresAt', type: 'uint256' },
//     ],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'escrowBalance',
//     outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     inputs: [],
//     name: 'owner',
//     outputs: [{ internalType: 'address', name: '', type: 'address' }],
//     stateMutability: 'view',
//     type: 'function',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
//       { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//     ],
//     name: 'Deposited',
//     type: 'event',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'party', type: 'address' },
//       { indexed: false, internalType: 'address', name: 'propertyNFT', type: 'address' },
//       { indexed: false, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
//       { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//     ],
//     name: 'Agreement',
//     type: 'event',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'propertyOwner', type: 'address' },
//       { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//       { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' },
//     ],
//     name: 'FundsReleased',
//     type: 'event',
//   },
//   {
//     anonymous: false,
//     inputs: [{ indexed: true, internalType: 'address', name: 'owner', type: 'address' }],
//     name: 'TransactionCancelled',
//     type: 'event',
//   },
//   {
//     anonymous: false,
//     inputs: [
//       { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
//       { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
//     ],
//     name: 'Withdrawn',
//     type: 'event',
//   },
// ];

// interface TransactionFormData {
//   propertyNFT: string;
//   tokenId: string;
//   amount: string;
// }

// interface DepositFormData {
//   amount: string;
// }

// interface TransactionDetails {
//   owner: string;
//   propertyOwner: string;
//   propertyNFT: string;
//   tokenId: number;
//   amount: bigint;
//   ownerAgreed: boolean;
//   propertyOwnerAgreed: boolean;
//   verifierAgreed: boolean;
//   verifier: string;
//   propertySelected: boolean;
//   agreementExpiresAt: number;
// }

// const EscrowDashboard = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { address: account, isConnected } = useWallet();
//   const { writeContractAsync, data: txHash, error: writeError, isPending } = useWriteContract();

//   const [escrowAddress, setEscrowAddress] = useState<`0x${string}` | null>(null);
//   const [isOwner, setIsOwner] = useState<boolean>(false);
//   const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
//   const [escrowBalance, setEscrowBalance] = useState<bigint>(BigInt(0));
//   const [formData, setFormData] = useState<TransactionFormData>({
//     propertyNFT: '',
//     tokenId: '',
//     amount: '',
//   });
//   const [depositFormData, setDepositFormData] = useState<DepositFormData>({ amount: '' });
//   const [activeTab, setActiveTab] = useState<'details' | 'deposit' | 'agree' | 'manage'>('details');
//   const [error, setError] = useState<string>('');
//   const [successMessage, setSuccessMessage] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [eventHistory, setEventHistory] = useState<
//     { event: string; description: string; timestamp: number }[]
//   >([]);

//   // Initialize from URL parameter - FIXED: Enhanced address detection
//   useEffect(() => {
//     const address = searchParams?.get('address');
//     console.log('EscrowDashboard: searchParams address:', address); // Debug log

//     if (address && isAddress(address)) {
//       console.log('Setting escrow address in EscrowDashboard:', address);
//       setEscrowAddress(address as `0x${string}`);
//     } else if (window && window.location.search.includes('address=')) {
//       // Try to parse from URL directly
//       const urlParams = new URLSearchParams(window.location.search);
//       const urlAddress = urlParams.get('address');

//       if (urlAddress && isAddress(urlAddress)) {
//         console.log('Setting escrow address from URL:', urlAddress);
//         setEscrowAddress(urlAddress as `0x${string}`);
//       } else {
//         setError('Invalid escrow address in URL. Please select a valid escrow.');
//       }
//     } else {
//       setError('No escrow address specified. Please select an escrow from the factory tab.');
//       // Only redirect if we're sure there's no address parameter to avoid loops
//       if (!window.location.search.includes('address=')) {
//         console.log('No address found, redirecting to dashboard');
//         router.push('/dashboard');
//       }
//     }
//   }, [searchParams, router]);

//   // Fetch escrow owner
//   const {
//     data: ownerAddress,
//     refetch: refetchOwner,
//     error: ownerError,
//   } = useReadContract({
//     address: escrowAddress ?? undefined,
//     abi: ESCROW_ABI,
//     functionName: 'owner',
//     chainId: baseSepolia.id,
//     query: {
//       enabled: !!escrowAddress && isAddress(escrowAddress),
//       retry: true,
//       retryDelay: 1000,
//     },
//   });

//   // Fetch escrow balance
//   const {
//     data: balance,
//     refetch: refetchBalance,
//     error: balanceError,
//   } = useReadContract({
//     address: escrowAddress ?? undefined,
//     abi: ESCROW_ABI,
//     functionName: 'escrowBalance',
//     chainId: baseSepolia.id,
//     query: {
//       enabled: !!escrowAddress && isAddress(escrowAddress),
//       retry: true,
//       retryDelay: 1000,
//     },
//   });

//   // Fetch transaction details
//   const {
//     data: transaction,
//     refetch: refetchTransaction,
//     error: transactionError,
//   } = useReadContract({
//     address: escrowAddress ?? undefined,
//     abi: ESCROW_ABI,
//     functionName: 'getTransactionDetails',
//     chainId: baseSepolia.id,
//     query: {
//       enabled: !!escrowAddress && isAddress(escrowAddress),
//       retry: true,
//       retryDelay: 1000,
//     },
//   });

//   // ADDED: Additional debug logging for contract data
//   useEffect(() => {
//     if (transaction) {
//       console.log('Transaction data received:', transaction);
//     }

//     if (balance !== undefined) {
//       console.log('Balance data received:', balance);
//     }

//     if (ownerAddress) {
//       console.log('Owner address received:', ownerAddress);
//     }
//   }, [transaction, balance, ownerAddress]);

//   // Watch for Deposited event
//   useWatchContractEvent({
//     address: escrowAddress ?? undefined,
//     abi: ESCROW_ABI,
//     eventName: 'Deposited',
//     onLogs(logs) {
//       if (!escrowAddress) return;

//       const log = logs[0];
//       if (log && log.args) {
//         const { owner, amount } = log.args;
//         setEventHistory((prev) => [
//           {
//             event: 'Deposited',
//             description: `${formatAddress(owner as string)} deposited ${formatEther(
//               amount as bigint,
//             )} ETH`,
//             timestamp: Date.now(),
//           },
//           ...prev,
//         ]);
//         refetchBalance();
//       }
//     },
//     onError(err) {
//       console.error('Error watching Deposited event:', err);
//       setError('Failed to listen to deposit events');
//     },
//     poll: true,
//     pollingInterval: 5000,
//   });

//   // Watch for Agreement event
//   useWatchContractEvent({
//     address: escrowAddress ?? undefined,
//     abi: ESCROW_ABI,
//     eventName: 'Agreement',
//     onLogs(logs) {
//       if (!escrowAddress) return;

//       const log = logs[0];
//       if (log && log.args) {
//         const { party, propertyNFT, tokenId, amount } = log.args;
//         setEventHistory((prev) => [
//           {
//             event: 'Agreement',
//             description: `${formatAddress(
//               party as string,
//             )} agreed to transaction for token #${tokenId} (${formatEther(amount as bigint)} ETH)`,
//             timestamp: Date.now(),
//           },
//           ...prev,
//         ]);
//         refetchTransaction();
//       }
//     },
//     onError(err) {
//       console.error('Error watching Agreement event:', err);
//       setError('Failed to listen to agreement events');
//     },
//     poll: true,
//     pollingInterval: 5000,
//   });

//   // Watch for TransactionCancelled event
//   useWatchContractEvent({
//     address: escrowAddress ?? undefined,
//     abi: ESCROW_ABI,
//     eventName: 'TransactionCancelled',
//     onLogs(logs) {
//       if (!escrowAddress) return;

//       const log = logs[0];
//       if (log && log.args) {
//         const { owner } = log.args;
//         setEventHistory((prev) => [
//           {
//             event: 'TransactionCancelled',
//             description: `${formatAddress(owner as string)} cancelled the transaction`,
//             timestamp: Date.now(),
//           },
//           ...prev,
//         ]);
//         refetchTransaction();
//       }
//     },
//     onError(err) {
//       console.error('Error watching TransactionCancelled event:', err);
//       setError('Failed to listen to transaction cancelled events');
//     },
//     poll: true,
//     pollingInterval: 5000,
//   });

//   // Watch for Withdrawn event
//   useWatchContractEvent({
//     address: escrowAddress ?? undefined,
//     abi: ESCROW_ABI,
//     eventName: 'Withdrawn',
//     onLogs(logs) {
//       if (!escrowAddress) return;

//       const log = logs[0];
//       if (log && log.args) {
//         const { owner, amount } = log.args;
//         setEventHistory((prev) => [
//           {
//             event: 'Withdrawn',
//             description: `${formatAddress(owner as string)} withdrew ${formatEther(
//               amount as bigint,
//             )} ETH`,
//             timestamp: Date.now(),
//           },
//           ...prev,
//         ]);
//         refetchBalance();
//       }
//     },
//     onError(err) {
//       console.error('Error watching Withdrawn event:', err);
//       setError('Failed to listen to withdrawal events');
//     },
//     poll: true,
//     pollingInterval: 5000,
//   });

//   // Watch for FundsReleased event
//   useWatchContractEvent({
//     address: escrowAddress ?? undefined,
//     abi: ESCROW_ABI,
//     eventName: 'FundsReleased',
//     onLogs(logs) {
//       if (!escrowAddress) return;

//       const log = logs[0];
//       if (log && log.args) {
//         const { propertyOwner, amount, fee } = log.args;
//         setEventHistory((prev) => [
//           {
//             event: 'FundsReleased',
//             description: `${formatAddress(propertyOwner as string)} received ${formatEther(
//               amount as bigint,
//             )} ETH (fee: ${formatEther(fee as bigint)} ETH)`,
//             timestamp: Date.now(),
//           },
//           ...prev,
//         ]);
//         refetchBalance();
//         refetchTransaction();
//       }
//     },
//     onError(err) {
//       console.error('Error watching FundsReleased event:', err);
//       setError('Failed to listen to funds released events');
//     },
//     poll: true,
//     pollingInterval: 5000,
//   });

//   // Check for contract read errors
//   useEffect(() => {
//     if (ownerError || balanceError || transactionError) {
//       const errorMessage =
//         ownerError?.message ||
//         balanceError?.message ||
//         transactionError?.message ||
//         'Error reading contract data';
//       console.error('Contract read error:', errorMessage);
//       if (
//         errorMessage.includes('could not be found') ||
//         errorMessage.includes('contract not deployed')
//       ) {
//         setError(
//           `The escrow contract at ${formatAddress(
//             escrowAddress ?? '',
//           )} is not deployed or is invalid. Please check the address and try again.`,
//         );
//       } else {
//         setError(`Failed to load escrow data: ${errorMessage}`);
//       }
//     }
//   }, [ownerError, balanceError, transactionError, escrowAddress]);

//   // Update local state based on contract data
//   useEffect(() => {
//     if (ownerAddress && account) {
//       console.log(`Checking ownership: ${ownerAddress.toLowerCase()} vs ${account.toLowerCase()}`);
//       setIsOwner(ownerAddress.toLowerCase() === account.toLowerCase());
//     }
//     if (balance !== undefined) {
//       setEscrowBalance(balance as bigint);
//     }
//     if (transaction && Array.isArray(transaction)) {
//       setTransactionDetails({
//         owner: transaction[0] as string,
//         propertyOwner: transaction[1] as string,
//         propertyNFT: transaction[2] as string,
//         tokenId: Number(transaction[3]),
//         amount: transaction[4] as bigint,
//         ownerAgreed: transaction[5] as boolean,
//         propertyOwnerAgreed: transaction[6] as boolean,
//         verifierAgreed: transaction[7] as boolean,
//         verifier: transaction[8] as string,
//         propertySelected: transaction[9] as boolean,
//         agreementExpiresAt: Number(transaction[10]),
//       });
//     }
//   }, [ownerAddress, account, balance, transaction]);

//   // Handle transaction confirmation and refresh data
//   useEffect(() => {
//     if (!txHash || loading) return;

//     const waitForConfirmation = async () => {
//       setLoading(true);
//       try {
//         // Added longer delay to ensure transaction is fully processed
//         await new Promise((resolve) => setTimeout(resolve, 3000));

//         console.log('Refreshing contract data after transaction');
//         await Promise.all([refetchOwner(), refetchBalance(), refetchTransaction()]);

//         setSuccessMessage('Transaction confirmed successfully');
//       } catch (err: any) {
//         console.error('Error refreshing data:', err);
//         setError(err.message || 'Failed to refresh escrow data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     waitForConfirmation();
//   }, [txHash, refetchOwner, refetchBalance, refetchTransaction, loading]);

//   // Handle write errors and clear success message
//   useEffect(() => {
//     if (writeError) {
//       setLoading(false);
//       setError(writeError.message || 'Transaction failed');
//       setSuccessMessage(''); // Clear success message on error
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

//   const handleFormChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleDepositFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setDepositFormData({ ...depositFormData, [e.target.name]: e.target.value });
//   };

//   const validateTransactionForm = (): boolean => {
//     if (!formData.propertyNFT || !isAddress(formData.propertyNFT)) {
//       setError('Valid Property NFT address is required');
//       return false;
//     }
//     if (!formData.tokenId || isNaN(Number(formData.tokenId)) || Number(formData.tokenId) < 0) {
//       setError('Valid token ID is required');
//       return false;
//     }
//     if (!formData.amount || Number(formData.amount) <= 0) {
//       setError('Amount must be greater than 0');
//       return false;
//     }
//     return true;
//   };

//   const validateDepositForm = (): boolean => {
//     if (!depositFormData.amount || Number(depositFormData.amount) <= 0) {
//       setError('Deposit amount must be greater than 0');
//       return false;
//     }
//     return true;
//   };

//   const handleDeposit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       if (!account) {
//         setError('Wallet not connected');
//         setLoading(false);
//         return;
//       }
//       if (!escrowAddress) {
//         setError('No escrow address found');
//         setLoading(false);
//         return;
//       }
//       if (!validateDepositForm()) {
//         setLoading(false);
//         return;
//       }

//       console.log(`Depositing ${depositFormData.amount} ETH to escrow ${escrowAddress}`);

//       await writeContractAsync({
//         address: escrowAddress,
//         abi: ESCROW_ABI,
//         functionName: 'deposit',
//         value: parseEther(depositFormData.amount),
//       });

//       setDepositFormData({ amount: '' });
//       console.log('Deposit transaction submitted');
//     } catch (err: any) {
//       console.error('Error submitting deposit transaction:', err);
//       setError(err.message || 'Failed to deposit funds');
//       setLoading(false);
//     }
//   };

//   const handleAgree = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       if (!account) {
//         setError('Wallet not connected');
//         setLoading(false);
//         return;
//       }
//       if (!escrowAddress) {
//         setError('No escrow address found');
//         setLoading(false);
//         return;
//       }
//       if (!transactionDetails?.propertySelected && !validateTransactionForm()) {
//         setLoading(false);
//         return;
//       }

//       console.log('Submitting agreement to transaction');
//       console.log(
//         'Using property:',
//         transactionDetails?.propertySelected
//           ? transactionDetails.propertyNFT
//           : formData.propertyNFT,
//       );

//       await writeContractAsync({
//         address: escrowAddress,
//         abi: ESCROW_ABI,
//         functionName: 'agreeToTransaction',
//         args: [
//           transactionDetails?.propertySelected
//             ? transactionDetails.propertyNFT
//             : formData.propertyNFT,
//           transactionDetails?.propertySelected
//             ? BigInt(transactionDetails.tokenId)
//             : BigInt(formData.tokenId),
//           transactionDetails?.propertySelected
//             ? transactionDetails.amount
//             : parseEther(formData.amount),
//         ],
//       });

//       setFormData({ propertyNFT: '', tokenId: '', amount: '' });
//       console.log('Agree transaction submitted');
//     } catch (err: any) {
//       console.error('Error submitting agree transaction:', err);
//       setError(err.message || 'Failed to agree to transaction');
//       setLoading(false);
//     }
//   };

//   const handleCancel = async () => {
//     setLoading(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       if (!account) {
//         setError('Wallet not connected');
//         setLoading(false);
//         return;
//       }
//       if (!escrowAddress) {
//         setError('No escrow address found');
//         setLoading(false);
//         return;
//       }

//       console.log('Cancelling transaction in escrow:', escrowAddress);

//       await writeContractAsync({
//         address: escrowAddress,
//         abi: ESCROW_ABI,
//         functionName: 'cancelTransaction',
//       });

//       console.log('Cancel transaction submitted');
//     } catch (err: any) {
//       console.error('Error submitting cancel transaction:', err);
//       setError(err.message || 'Failed to cancel transaction');
//       setLoading(false);
//     }
//   };

//   const handleWithdraw = async () => {
//     setLoading(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       if (!account) {
//         setError('Wallet not connected');
//         setLoading(false);
//         return;
//       }
//       if (!escrowAddress) {
//         setError('No escrow address found');
//         setLoading(false);
//         return;
//       }

//       console.log('Withdrawing funds from escrow:', escrowAddress);

//       await writeContractAsync({
//         address: escrowAddress,
//         abi: ESCROW_ABI,
//         functionName: 'withdraw',
//       });

//       console.log('Withdraw transaction submitted');
//     } catch (err: any) {
//       console.error('Error submitting withdraw transaction:', err);
//       setError(err.message || 'Failed to withdraw funds');
//       setLoading(false);
//     }
//   };

//   const formatTimestamp = (timestamp: number) => {
//     return timestamp > 0 ? new Date(timestamp * 1000).toLocaleString() : 'Not Set';
//   };

//   const formatAddress = (address: string) => {
//     return address && isAddress(address)
//       ? `${address.slice(0, 6)}...${address.slice(-4)}`
//       : 'Unknown';
//   };

//   const isNullAddress = (address: string) => {
//     return !address || address === '0x0000000000000000000000000000000000000000';
//   };

//   return (
//     <div className='max-w-6xl mx-auto px-4 py-8 font-inter text-white'>
//       <h1 className='text-2xl font-semibold mb-8'>Escrow Dashboard</h1>

//       {/* Error Alert */}
//       {error && (
//         <Alert variant='destructive' className='mb-6'>
//           <div className='flex items-start'>
//             <AlertTriangle className='h-5 w-5 mr-2 mt-0.5' />
//             <div>
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </div>
//           </div>
//         </Alert>
//       )}

//       {/* Success Alert */}
//       {successMessage && (
//         <Alert variant='success' className='mb-6'>
//           <div className='flex items-start'>
//             <CheckCircle className='h-5 w-5 mr-2 mt-0.5' />
//             <div>
//               <AlertTitle>Success</AlertTitle>
//               <AlertDescription>{successMessage}</AlertDescription>
//             </div>
//           </div>
//         </Alert>
//       )}

//       {!isConnected ? (
//         <div className='text-center py-12 bg-[#1D0E2E] rounded-lg'>
//           <p className='text-white/70 mb-4'>Connect your wallet to manage escrows</p>
//         </div>
//       ) : !escrowAddress ? (
//         <div className='text-center py-12 bg-[#1D0E2E] rounded-lg'>
//           <p className='text-white/70 mb-4'>No escrow address found. Create an escrow first.</p>
//           <button
//             onClick={() => router.push('/dashboard')}
//             className='px-4 py-2 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg font-medium hover:shadow-xl transition-all'
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       ) : (
//         <div className='bg-[#1D0E2E] rounded-lg p-6 border border-white/10'>
//           <div className='mb-6 flex justify-between items-center'>
//             <div>
//               <h2 className='text-xl font-medium'>Escrow: {formatAddress(escrowAddress)}</h2>
//               <a
//                 href={`${baseSepolia.blockExplorers.default.url}/address/${escrowAddress}`}
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 className='flex items-center text-xs text-teal-400 hover:text-teal-300 mt-1'
//               >
//                 View on BaseScan <ExternalLink className='w-3 h-3 ml-1' />
//               </a>
//             </div>
//             <div className='flex space-x-2'>
//               {transactionDetails?.propertySelected ? (
//                 <span className='px-3 py-1 text-sm bg-yellow-500/20 text-yellow-300 rounded-md'>
//                   Transaction In Progress
//                 </span>
//               ) : (
//                 <span className='px-3 py-1 text-sm bg-green-500/20 text-green-300 rounded-md'>
//                   Open
//                 </span>
//               )}
//               {isOwner && (
//                 <span className='px-3 py-1 text-sm bg-blue-500/20 text-blue-300 rounded-md'>
//                   You are owner
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className='border-b border-white/10 mb-6'>
//             <nav className='flex space-x-6'>
//               <button
//                 onClick={() => setActiveTab('details')}
//                 className={`pb-3 px-1 ${
//                   activeTab === 'details'
//                     ? 'border-b-2 border-teal-400 text-teal-400'
//                     : 'text-white/70 hover:text-white'
//                 }`}
//               >
//                 Details
//               </button>
//               {isOwner && (
//                 <button
//                   onClick={() => setActiveTab('deposit')}
//                   className={`pb-3 px-1 ${
//                     activeTab === 'deposit'
//                       ? 'border-b-2 border-teal-400 text-teal-400'
//                       : 'text-white/70 hover:text-white'
//                   }`}
//                 >
//                   Deposit
//                 </button>
//               )}
//               <button
//                 onClick={() => setActiveTab('agree')}
//                 className={`pb-3 px-1 ${
//                   activeTab === 'agree'
//                     ? 'border-b-2 border-teal-400 text-teal-400'
//                     : 'text-white/70 hover:text-white'
//                 }`}
//               >
//                 Agree
//               </button>
//               {isOwner && (
//                 <button
//                   onClick={() => setActiveTab('manage')}
//                   className={`pb-3 px-1 ${
//                     activeTab === 'manage'
//                       ? 'border-b-2 border-teal-400 text-teal-400'
//                       : 'text-white/70 hover:text-white'
//                   }`}
//                 >
//                   Manage
//                 </button>
//               )}
//             </nav>
//           </div>

//           {/* Details Tab */}
//           {activeTab === 'details' && (
//             <div className='space-y-6'>
//               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                 <div>
//                   <h3 className='text-lg font-medium mb-2'>Escrow Information</h3>
//                   <div className='space-y-2 text-sm'>
//                     <p>
//                       <span className='text-white/70'>Owner:</span>{' '}
//                       {formatAddress(transactionDetails?.owner)}
//                     </p>
//                     <p>
//                       <span className='text-white/70'>Balance:</span> {formatEther(escrowBalance)}{' '}
//                       ETH
//                     </p>
//                     <p>
//                       <span className='text-white/70'>Property NFT:</span>{' '}
//                       {isNullAddress(transactionDetails?.propertyNFT)
//                         ? 'Not Set'
//                         : formatAddress(transactionDetails?.propertyNFT)}
//                     </p>
//                     <p>
//                       <span className='text-white/70'>Token ID:</span>{' '}
//                       {transactionDetails?.tokenId || 'Not Set'}
//                     </p>
//                     <p>
//                       <span className='text-white/70'>Amount:</span>{' '}
//                       {transactionDetails?.amount ? formatEther(transactionDetails.amount) : '0'}{' '}
//                       ETH
//                     </p>
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className='text-lg font-medium mb-2'>Transaction Status</h3>
//                   <div className='space-y-2 text-sm'>
//                     <p>
//                       <span className='text-white/70'>Owner Agreed:</span>{' '}
//                       {transactionDetails?.ownerAgreed ? 'Yes' : 'No'}
//                     </p>
//                     <p>
//                       <span className='text-white/70'>Property Owner:</span>{' '}
//                       {isNullAddress(transactionDetails?.propertyOwner)
//                         ? 'Not Set'
//                         : formatAddress(transactionDetails?.propertyOwner)}
//                     </p>
//                     <p>
//                       <span className='text-white/70'>Property Owner Agreed:</span>{' '}
//                       {transactionDetails?.propertyOwnerAgreed ? 'Yes' : 'No'}
//                     </p>
//                     <p>
//                       <span className='text-white/70'>Verifier:</span>{' '}
//                       {isNullAddress(transactionDetails?.verifier)
//                         ? 'Not Set'
//                         : formatAddress(transactionDetails?.verifier)}
//                     </p>
//                     <p>
//                       <span className='text-white/70'>Verifier Agreed:</span>{' '}
//                       {transactionDetails?.verifierAgreed ? 'Yes' : 'No'}
//                     </p>
//                     <p>
//                       <span className='text-white/70'>Expires At:</span>{' '}
//                       {formatTimestamp(transactionDetails?.agreementExpiresAt || 0)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               {eventHistory.length > 0 && (
//                 <div>
//                   <h3 className='text-lg font-medium mb-2'>Event History</h3>
//                   <div className='space-y-2'>
//                     {eventHistory.map((event, index) => (
//                       <div key={index} className='p-3 bg-[#2D1E3E] rounded-lg text-sm'>
//                         <p className='text-white/70'>
//                           {new Date(event.timestamp).toLocaleString()} - {event.event}
//                         </p>
//                         <p>{event.description}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Deposit Tab */}
//           {activeTab === 'deposit' && isOwner && (
//             <div className='space-y-6'>
//               <h3 className='text-lg font-medium'>Deposit Funds</h3>
//               <form onSubmit={handleDeposit} className='space-y-4 max-w-md'>
//                 <div>
//                   <label className='block text-sm text-white/70 mb-1'>Amount (ETH)</label>
//                   <input
//                     type='number'
//                     name='amount'
//                     value={depositFormData.amount}
//                     onChange={handleDepositFormChange}
//                     className='w-full p-2 bg-[#2D1E3E] border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-400'
//                     placeholder='0.0'
//                     step='0.01'
//                     min='0'
//                   />
//                 </div>
//                 <button
//                   type='submit'
//                   disabled={loading || isPending}
//                   className='w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl'
//                 >
//                   {loading || isPending ? (
//                     <span className='flex items-center justify-center'>
//                       <span className='inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2'></span>
//                       Depositing...
//                     </span>
//                   ) : (
//                     'Deposit'
//                   )}
//                 </button>
//               </form>
//             </div>
//           )}

//           {/* Agree Tab */}
//           {activeTab === 'agree' && (
//             <div className='space-y-6'>
//               <h3 className='text-lg font-medium'>Agree to Transaction</h3>
//               {!transactionDetails?.propertySelected ? (
//                 <form onSubmit={handleAgree} className='space-y-4 max-w-md'>
//                   <div>
//                     <label className='block text-sm text-white/70 mb-1'>Property NFT Address</label>
//                     <input
//                       type='text'
//                       name='propertyNFT'
//                       value={formData.propertyNFT}
//                       onChange={handleFormChange}
//                       className='w-full p-2 bg-[#2D1E3E] border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-400'
//                       placeholder='0x...'
//                     />
//                   </div>
//                   <div>
//                     <label className='block text-sm text-white/70 mb-1'>Token ID</label>
//                     <input
//                       type='number'
//                       name='tokenId'
//                       value={formData.tokenId}
//                       onChange={handleFormChange}
//                       className='w-full p-2 bg-[#2D1E3E] border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-400'
//                       placeholder='0'
//                       min='0'
//                     />
//                   </div>
//                   <div>
//                     <label className='block text-sm text-white/70 mb-1'>Amount (ETH)</label>
//                     <input
//                       type='number'
//                       name='amount'
//                       value={formData.amount}
//                       onChange={handleFormChange}
//                       className='w-full p-2 bg-[#2D1E3E] border border-white/10 rounded-lg text-white focus:outline-none focus:border-teal-400'
//                       placeholder='0.0'
//                       step='0.01'
//                       min='0'
//                     />
//                   </div>
//                   <button
//                     type='submit'
//                     disabled={loading || isPending}
//                     className='w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl'
//                   >
//                     {loading || isPending ? (
//                       <span className='flex items-center justify-center'>
//                         <span className='inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2'></span>
//                         Agreeing...
//                       </span>
//                     ) : (
//                       'Agree to Transaction'
//                     )}
//                   </button>
//                 </form>
//               ) : (
//                 <div>
//                   <p className='text-white/70 mb-4'>
//                     Transaction is in progress. Confirm your agreement below.
//                   </p>
//                   <button
//                     onClick={handleAgree}
//                     disabled={loading || isPending}
//                     className='py-3 px-6 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl'
//                   >
//                     {loading || isPending ? (
//                       <span className='flex items-center justify-center'>
//                         <span className='inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2'></span>
//                         Agreeing...
//                       </span>
//                     ) : (
//                       'Confirm Agreement'
//                     )}
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Manage Tab */}
//           {activeTab === 'manage' && isOwner && (
//             <div className='space-y-6'>
//               <h3 className='text-lg font-medium'>Manage Escrow</h3>
//               <div className='space-y-4'>
//                 <div>
//                   <p className='text-white/70 mb-2'>
//                     Withdraw funds if the transaction is cancelled or expired.
//                   </p>
//                   <button
//                     onClick={handleWithdraw}
//                     disabled={
//                       loading ||
//                       isPending ||
//                       !transactionDetails ||
//                       (transactionDetails?.propertySelected &&
//                         transactionDetails.agreementExpiresAt * 1000 > Date.now())
//                     }
//                     className='py-3 px-6 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl'
//                   >
//                     {loading || isPending ? (
//                       <span className='flex items-center justify-center'>
//                         <span className='inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2'></span>
//                         Withdrawing...
//                       </span>
//                     ) : (
//                       'Withdraw Funds'
//                     )}
//                   </button>
//                 </div>
//                 <div>
//                   <p className='text-white/70 mb-2'>
//                     Cancel the transaction to reclaim deposited funds.
//                   </p>
//                   <button
//                     onClick={handleCancel}
//                     disabled={loading || isPending || !transactionDetails?.propertySelected}
//                     className='py-3 px-6 rounded-lg bg-red-500/20 text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-red-500/30'
//                   >
//                     {loading || isPending ? (
//                       <span className='flex items-center justify-center'>
//                         <span className='inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2'></span>
//                         Cancelling...
//                       </span>
//                     ) : (
//                       'Cancel Transaction'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EscrowDashboard;
