// import React from 'react';

// import DashBoardLayout from '../DashboardLayout';

// import DashBoardPropertyCard from '@/src/ui/ownerDashboard/PropertyTab';
// import AlertItem from '@/src/ui/ownerDashboard/Notification';
// import EscrowTransaction from '@/src/ui/ownerDashboard/EscrowTransaction';
// import BalanceCard from '@/src/ui/ownerDashboard/BalanceCard';
// import StatsCards from '@/src/ui/ownerDashboard/StatsCards';

// // Sample transaction data
// const transactionData = [
//   { id: 1, property: '3BR Surulere', status: 'In Progress' as const, amount: '0.75 ETH' },
//   { id: 2, property: 'Shop Ikeja', status: 'Completed' as const, amount: '0.75 ETH' },
//   { id: 3, property: '3BR Surulere', status: 'In Progress' as const, amount: '0.75 ETH' },
//   { id: 4, property: 'Shop Ikeja', status: 'Completed' as const, amount: '0.75 ETH' },
// ];

// // Sample alerts
// const alertsData = [
//   { id: 1, message: 'New verified listings available in your area.' },
//   { id: 2, message: 'Your transaction with HomeFinders is now Escrowed.' },
//   { id: 3, message: 'Wallet top-up successful: +5 ETH.' },
// ];

// const Dashboard = () => {
//   return (
//     <DashBoardLayout>
//       <div
//         className='welcome-section text-center mb-8 rounded-lg p-6'
//         style={{
//           background:
//             'radial-gradient(50% 206.8% at 50% 50%, rgba(10, 88, 116, 0.7) 0%, rgba(32, 23, 38, 0.7) 56.91%)',
//         }}
//       >
//         <h1 className='font-poppins font-semibold text-3xl md:text-4xl leading-[170%] mb-2'>
//         Welcome Back, Leine!
//         </h1>
//         <p className='font-vietnam font-normal text-base leading-[170%] tracking-[1%] text-[hsl(var(--foreground)/0.7)]'>
//         Manage listings, serve clients, grow your reputation.
//         </p>
//       </div>

//       <div className='mb-10'>
//         <StatsCards/>
//       </div>

//         <div className=''>
//             <DashBoardPropertyCard/>
//         </div>

//       <div className='mb-10'>
//         <h2 className='font-poppins font-semibold text-xl md:text-2xl mb-6'>Escrow Transactions</h2>
//         <div className='bg-[hsl(var(--foreground)/0.05)] rounded-lg overflow-hidden border border-[hsl(var(--border))]'>
//           <div className='overflow-x-auto'>
//             <table className='min-w-full'>
//               <thead>
//                 <tr className='bg-[hsl(var(--transaction-table-header-background)/1)] border-b border-[hsl(var(--border))]'>
//                   <th className='px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider'>
//                     Property
//                   </th>
//                   <th className='px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider'>
//                     Status
//                   </th>
//                   <th className='px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider'>
//                     Amount (ETH)
//                   </th>
//                   <th className='px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider'>
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {transactionData.map((transaction) => (
//                   <EscrowTransaction key={transaction.id} transaction={transaction} />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       <div className='mb-10'>
//         <h2 className='font-poppins font-semibold text-xl md:text-2xl mb-6'>
//         Certification Vault
//         </h2>
//        <p className='text-sm'>
//        Upload certifications to boost your trust profile.
//        </p>
//         <button className='mt-4 px-6 py-3 bg-gradient-to-r from-[hsl(var(--primary-from))] to-[hsl(var(--primary-to))] text-[hsl(var(--foreground))] rounded-3xl hover:opacity-90 transition text-sm font-medium'>
//         Upload Now
//         </button>
//       </div>

//       <div>
//         <BalanceCard/>
//       </div>

//       <div className='mb-10 border mt-10 border-[hsl(var(--border))] flex  p-6  flex-col rounded-lg'>
//         <h2 className='font-poppins font-semibold flex text-xl md:text-2xl mb-6'>
//           Notifications
//         </h2>
//         <div className='space-y-2'>
//           {alertsData.map((alert) => (
//             <AlertItem key={alert.id} alert={alert} />
//           ))}
//         </div>
//       </div>
//     </DashBoardLayout>
//   );
// };

// export default Dashboard;
