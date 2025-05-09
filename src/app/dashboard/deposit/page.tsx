// 'use client';

// import { useState, useEffect, Suspense } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import DashboardLayout from '../DashboardLayout';
// import EscrowFactoryDashboard from './EscrowFactoryDashboard';
// import EscrowDashboard from './EscrowDashboard';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/ui/dashboard/tab';
// import { Building, Wallet, LogOut, ExternalLink, Shield } from 'lucide-react';
// import { useWallet } from '../../../contexts/WalletContext';

// // Simple Connect Wallet Button using our context
// function ConnectWalletButton() {
//   const { connect, isConnecting, connectError } = useWallet();

//   return (
//     <div className='relative'>
//       <button
//         onClick={() => connect()}
//         disabled={isConnecting}
//         className='flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition disabled:opacity-50'
//       >
//         <Wallet className='w-4 h-4' />
//         {isConnecting ? 'Connecting...' : 'Connect Wallet'}
//       </button>

//       {connectError && (
//         <div className='absolute top-full mt-2 right-0 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm max-w-xs'>
//           {connectError.message}
//         </div>
//       )}
//     </div>
//   );
// }

// // Inner component to handle searchParams
// function EscrowDashboardPageContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('factory');
//   const { address, isConnected, disconnect } = useWallet();

//   // Function to get address from URL as a fallback
//   const getAddressFromUrl = () => {
//     if (typeof window === 'undefined') return null;
//     const params = new URLSearchParams(window.location.search);
//     return params.get('address');
//   };

//   // FIXED: More robust tab switching based on URL params
//   useEffect(() => {
//     const escrowAddress = searchParams.get('address') || getAddressFromUrl();
//     console.log('EscrowDashboardPageContent: searchParams address:', escrowAddress);
//     console.log('EscrowDashboardPageContent: current activeTab:', activeTab);

//     if (escrowAddress && activeTab !== 'escrow') {
//       console.log('Switching to escrow tab due to address:', escrowAddress);
//       setActiveTab('escrow');
//     } else if (!escrowAddress && activeTab === 'escrow') {
//       console.log('Switching to factory tab: no address found');
//       setActiveTab('factory');
//     }
//   }, [searchParams, activeTab]);

//   // ADDED: Ensure tab is correct on initial render
//   useEffect(() => {
//     const escrowAddress = searchParams.get('address');
//     if (escrowAddress && activeTab !== 'escrow') {
//       console.log('Initial render: Setting tab to escrow due to address parameter');
//       setActiveTab('escrow');
//     }
//   }, []);

//   // Handle manual tab change and ensure escrow tab is only selectable with address
//   const handleTabChange = (value: string) => {
//     console.log('handleTabChange:', { value, hasAddress: !!searchParams.get('address') });
//     if (value === 'escrow' && !searchParams.get('address')) {
//       console.log('Prevented switch to escrow tab: no address');
//       return;
//     }
//     setActiveTab(value);
//   };

//   return (
//     <DashboardLayout>
//       <div className='max-w-6xl mx-auto px-4 py-8'>
//         <div className='flex justify-between items-center mb-8'>
//           <div>
//             <h1 className='text-3xl font-semibold text-white font-poppins'>Escrow Management</h1>
//             <p className='text-white/70 mt-2'>
//               Create and manage secure escrow transactions for property deals
//             </p>
//           </div>

//           {/* Wallet Connection */}
//           <div>
//             {isConnected ? (
//               <div className='flex items-center space-x-4'>
//                 <div className='bg-[#2D1E3E] px-4 py-2 rounded-lg border border-white/10'>
//                   <div className='flex items-center gap-2'>
//                     <span className='inline-block w-2 h-2 bg-green-400 rounded-full'></span>
//                     <p className='text-white/70 text-sm'>Connected to Base Sepolia</p>
//                   </div>
//                   <div className='flex items-center gap-2'>
//                     <p className='text-white font-medium'>
//                       {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
//                     </p>
//                     {address && (
//                       <a
//                         href={`https://sepolia.basescan.org/address/${address}`}
//                         target='_blank'
//                         rel='noopener noreferrer'
//                         className='text-teal-400 hover:text-teal-300 transition'
//                         title='View on BaseScan'
//                       >
//                         <ExternalLink className='w-3 h-3' />
//                       </a>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => disconnect()}
//                   className='p-2 rounded-lg bg-[#2D1E3E] border border-white/10 text-white/70 hover:text-white hover:bg-[#3D2E4E] transition'
//                   title='Disconnect wallet'
//                 >
//                   <LogOut className='w-5 h-5' />
//                 </button>
//               </div>
//             ) : (
//               <ConnectWalletButton />
//             )}
//           </div>
//         </div>

//         <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
//           <div className='flex justify-center mb-6'>
//             <TabsList className='bg-[#1D0E2E] p-1 rounded-lg'>
//               <TabsTrigger
//                 value='factory'
//                 className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${
//                   activeTab === 'factory'
//                     ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white'
//                     : 'text-white/70 hover:text-white'
//                 }`}
//               >
//                 <Building className='w-4 h-4' />
//                 <span>Escrow Factory</span>
//               </TabsTrigger>
//               <TabsTrigger
//                 value='escrow'
//                 className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${
//                   activeTab === 'escrow'
//                     ? 'bg-gradient-to-r from-teal-500 to-purple-500 text-white'
//                     : 'text-white/70 hover:text-white'
//                 } ${!searchParams.get('address') ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 disabled={!searchParams.get('address')}
//               >
//                 <Shield className='w-4 h-4' />
//                 <span>Escrow Details</span>
//               </TabsTrigger>
//             </TabsList>
//           </div>

//           <TabsContent value='factory' className='mt-0'>
//             <EscrowFactoryDashboard />
//           </TabsContent>

//           <TabsContent value='escrow' className='mt-0'>
//             <EscrowDashboard />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </DashboardLayout>
//   );
// }

// // Wrap the component in Suspense
// export default function EscrowDashboardPage() {
//   return (
//     <Suspense fallback={<div className='text-white text-center py-8'>Loading...</div>}>
//       <EscrowDashboardPageContent />
//     </Suspense>
//   );
// }
