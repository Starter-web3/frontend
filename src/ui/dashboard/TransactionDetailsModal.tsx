// import React from 'react';
// import { ethers } from 'ethers';
// import {
//   X,
//   CheckCircle,
//   AlertCircle,
//   Clock,
//   FileText,
//   User,
//   Home,
//   Calendar,
//   DollarSign,
// } from 'lucide-react';
// import { Transaction, AGREEMENT_DURATION, FEE_PERCENTAGE } from '@/src/app/dashboard/deposit/types';

// interface TransactionDetailsModalProps {
//   transaction: Transaction | null;
//   onClose: () => void;
//   properties: any[];
// }

// const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
//   transaction,
//   onClose,
//   properties,
// }) => {
//   if (!transaction) return null;

//   // Format date from timestamp
//   const formatDate = (timestamp: number) => {
//     if (!timestamp) return 'Not set';
//     return new Date(timestamp * 1000).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   // Find property details
//   const getPropertyDetails = () => {
//     return properties.find((p) => p.address === transaction.propertyNFT) || null;
//   };

//   const property = getPropertyDetails();

//   // Get status info
//   const getStatusInfo = () => {
//     if (transaction.ownerAgreed && transaction.propertyOwnerAgreed && transaction.verifierAgreed) {
//       return {
//         text: 'Completed',
//         color: 'text-green-400',
//         bgColor: 'bg-green-600/20',
//         icon: <CheckCircle className='w-5 h-5' />,
//       };
//     } else if (transaction.propertySelected) {
//       if (Date.now() / 1000 > transaction.agreementExpiresAt) {
//         return {
//           text: 'Expired',
//           color: 'text-red-400',
//           bgColor: 'bg-red-600/20',
//           icon: <AlertCircle className='w-5 h-5' />,
//         };
//       } else if (transaction.ownerAgreed) {
//         return {
//           text: 'Owner Agreed',
//           color: 'text-blue-400',
//           bgColor: 'bg-blue-600/20',
//           icon: <CheckCircle className='w-5 h-5' />,
//         };
//       } else {
//         return {
//           text: 'Pending',
//           color: 'text-yellow-400',
//           bgColor: 'bg-yellow-600/20',
//           icon: <Clock className='w-5 h-5' />,
//         };
//       }
//     } else {
//       return {
//         text: 'Not Started',
//         color: 'text-white/70',
//         bgColor: 'bg-white/10',
//         icon: <FileText className='w-5 h-5' />,
//       };
//     }
//   };

//   const statusInfo = getStatusInfo();

//   return (
//     <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
//       <div className='bg-[#1D0E2E] border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
//         <div className='sticky top-0 bg-[#1D0E2E] border-b border-white/10 p-4 flex justify-between items-center'>
//           <h2 className='text-xl font-medium'>Transaction Details</h2>
//           <button onClick={onClose} className='p-1 rounded-full hover:bg-white/10'>
//             <X className='w-5 h-5' />
//           </button>
//         </div>

//         <div className='p-6 space-y-6'>
//           {/* Transaction Header */}
//           <div className='flex items-start justify-between'>
//             <div>
//               <h3 className='text-2xl font-medium'>{property?.title || 'Selected Property'}</h3>
//               <p className='text-white/70'>Token ID #{transaction.tokenId}</p>
//             </div>
//             <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.bgColor}`}>
//               {statusInfo.icon}
//               <span className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
//             </div>
//           </div>

//           {/* Amount & Timeline */}
//           <div className='bg-[#160820] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4'>
//             <div className='flex items-center gap-3'>
//               <DollarSign className='w-8 h-8 text-teal-400' />
//               <div>
//                 <p className='text-white/50 text-sm'>Amount in Escrow</p>
//                 <p className='text-2xl font-medium'>{ethers.formatEther(transaction.amount)} ETH</p>
//               </div>
//             </div>
//             <div className='h-12 border-l border-white/10 hidden md:block'></div>
//             <div className='flex items-center gap-3'>
//               <Calendar className='w-8 h-8 text-purple-400' />
//               <div>
//                 <p className='text-white/50 text-sm'>Expires On</p>
//                 <p className='text-lg font-medium'>{formatDate(transaction.agreementExpiresAt)}</p>
//               </div>
//             </div>
//           </div>

//           {/* Agreement Status */}
//           <div className='space-y-4'>
//             <h4 className='text-lg font-medium'>Agreement Status</h4>

//             <div className='bg-[#160820] rounded-lg p-4 space-y-4'>
//               <div className='flex items-center justify-between'>
//                 <div className='flex items-center gap-2'>
//                   <div
//                     className={`w-4 h-4 rounded-full flex items-center justify-center ${
//                       transaction.ownerAgreed ? 'bg-green-500' : 'bg-white/10'
//                     }`}
//                   >
//                     {transaction.ownerAgreed && <CheckCircle className='w-3 h-3 text-white' />}
//                   </div>
//                   <span>Owner (You)</span>
//                 </div>
//                 <span className={transaction.ownerAgreed ? 'text-green-400' : 'text-white/50'}>
//                   {transaction.ownerAgreed ? 'Agreed' : 'Pending'}
//                 </span>
//               </div>

//               <div className='flex items-center justify-between'>
//                 <div className='flex items-center gap-2'>
//                   <div
//                     className={`w-4 h-4 rounded-full flex items-center justify-center ${
//                       transaction.propertyOwnerAgreed ? 'bg-green-500' : 'bg-white/10'
//                     }`}
//                   >
//                     {transaction.propertyOwnerAgreed && (
//                       <CheckCircle className='w-3 h-3 text-white' />
//                     )}
//                   </div>
//                   <span>Property Owner</span>
//                 </div>
//                 <span
//                   className={transaction.propertyOwnerAgreed ? 'text-green-400' : 'text-white/50'}
//                 >
//                   {transaction.propertyOwnerAgreed ? 'Agreed' : 'Pending'}
//                 </span>
//               </div>

//               <div className='flex items-center justify-between'>
//                 <div className='flex items-center gap-2'>
//                   <div
//                     className={`w-4 h-4 rounded-full flex items-center justify-center ${
//                       transaction.verifierAgreed ? 'bg-green-500' : 'bg-white/10'
//                     }`}
//                   >
//                     {transaction.verifierAgreed && <CheckCircle className='w-3 h-3 text-white' />}
//                   </div>
//                   <span>Verifier</span>
//                 </div>
//                 <span className={transaction.verifierAgreed ? 'text-green-400' : 'text-white/50'}>
//                   {transaction.verifierAgreed ? 'Agreed' : 'Pending'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Transaction Details */}
//           <div className='space-y-4'>
//             <h4 className='text-lg font-medium'>Transaction Information</h4>

//             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//               <div className='bg-[#160820] rounded-lg p-4'>
//                 <p className='text-white/50 text-sm mb-1'>Agreement Date</p>
//                 <div className='flex items-center gap-2'>
//                   <Clock className='w-4 h-4 text-white/70' />
//                   <p>{formatDate(transaction.agreementExpiresAt - AGREEMENT_DURATION)}</p>
//                 </div>
//               </div>

//               <div className='bg-[#160820] rounded-lg p-4'>
//                 <p className='text-white/50 text-sm mb-1'>Agreement Duration</p>
//                 <div className='flex items-center gap-2'>
//                   <Calendar className='w-4 h-4 text-white/70' />
//                   <p>{AGREEMENT_DURATION / (24 * 60 * 60)} days</p>
//                 </div>
//               </div>

//               <div className='bg-[#160820] rounded-lg p-4'>
//                 <p className='text-white/50 text-sm mb-1'>Fee Percentage</p>
//                 <div className='flex items-center gap-2'>
//                   <DollarSign className='w-4 h-4 text-white/70' />
//                   <p>{FEE_PERCENTAGE / 100}%</p>
//                 </div>
//               </div>

//               <div className='bg-[#160820] rounded-lg p-4'>
//                 <p className='text-white/50 text-sm mb-1'>Property NFT</p>
//                 <div className='flex items-center gap-2'>
//                   <Home className='w-4 h-4 text-white/70' />
//                   <p className='truncate'>
//                     {transaction.propertyNFT.substring(0, 8)}...
//                     {transaction.propertyNFT.substring(transaction.propertyNFT.length - 6)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Parties Involved */}
//           <div className='space-y-4'>
//             <h4 className='text-lg font-medium'>Parties Involved</h4>

//             <div className='space-y-3'>
//               <div className='bg-[#160820] rounded-lg p-4'>
//                 <p className='text-white/50 text-sm mb-1'>Owner (You)</p>
//                 <div className='flex items-center gap-2'>
//                   <User className='w-4 h-4 text-white/70' />
//                   <p className='text-ellipsis overflow-hidden'>{transaction.owner}</p>
//                 </div>
//               </div>

//               <div className='bg-[#160820] rounded-lg p-4'>
//                 <p className='text-white/50 text-sm mb-1'>Property Owner</p>
//                 <div className='flex items-center gap-2'>
//                   <User className='w-4 h-4 text-white/70' />
//                   <p className='text-ellipsis overflow-hidden'>{transaction.propertyOwner}</p>
//                 </div>
//               </div>

//               <div className='bg-[#160820] rounded-lg p-4'>
//                 <p className='text-white/50 text-sm mb-1'>Verifier</p>
//                 <div className='flex items-center gap-2'>
//                   <User className='w-4 h-4 text-white/70' />
//                   <p className='text-ellipsis overflow-hidden'>{transaction.verifier}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TransactionDetailsModal;
