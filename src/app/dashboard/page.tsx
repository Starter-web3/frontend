import React from 'react';

import DashBoardLayout from './DashboardLayout';

//import DashBoardPropertyCard from '@/src/ui/dashboard/PropertyCard';
// import SavedPropertyItem from '@/src/ui/dashboard/SavedPropertyItem';
// import TransactionItem from '@/src/ui/dashboard/TransactionItem';
// import AlertItem from '@/src/ui/dashboard/AlertItem';

// Sample property data
// const propertyData = [
//   {
//     id: 1,
//     title: '2BR Apartment – Yaba',
//     price: '2,500',
//     ethPrice: '0.85',
//     location: 'Ziks Avenue, Yaba',
//     bedrooms: 2,
//     bathrooms: 2,
//     area: '1,200',
//     type: 'Apartment',
//     image: null, // Use null for placeholder
//     zone: 'Yaba Zone',
//     verified: true,
//     nairaPrice: '1,875,000', // Added nairaPrice field
//   },
//   {
//     id: 2,
//     title: '2BR Apartment – Yaba',
//     price: '2,500',
//     ethPrice: '0.85',
//     location: 'Ziks Avenue, Yaba',
//     bedrooms: 2,
//     bathrooms: 2,
//     area: '1,200',
//     type: 'Apartment',
//     image: null, // Use null for placeholder
//     zone: 'Yaba Zone',
//     verified: true,
//   },
//   {
//     id: 3,
//     title: '2BR Apartment – Yaba',
//     price: '2,500',
//     ethPrice: '0.85',
//     location: 'Ziks Avenue, Yaba',
//     bedrooms: 2,
//     bathrooms: 2,
//     area: '1,200',
//     type: 'Apartment',
//     image: null, // Use null for placeholder
//     zone: 'Yaba Zone',
//     verified: true,
//   },
// ];

// // Sample transaction data
// const transactionData = [
//   { id: 1, property: '3BR Surulere', status: 'In Progress' as const, amount: '0.75 ETH' },
//   { id: 2, property: 'Shop Ikeja', status: 'Escrowed' as const, amount: '0.75 ETH' },
//   { id: 3, property: '3BR Surulere', status: 'In Progress' as const, amount: '0.75 ETH' },
//   { id: 4, property: 'Shop Ikeja', status: 'Escrowed' as const, amount: '0.75 ETH' },
// ];

// // Sample saved properties
// const savedProperties = [
//   { id: 1, title: '2BR Flat in Lekki – 0.8 ETH / $2,500' },
//   { id: 2, title: 'Studio Apartment in Yaba – 7.50 ETH / $2,500' },
//   { id: 3, title: 'Mini-flat in Ajah – 0.95 ETH / $2,500' },
// ];

// // Sample alerts
// const alertsData = [
//   { id: 1, message: 'New verified listings available in your area.' },
//   { id: 2, message: 'Your transaction with HomeFinders is now Escrowed.' },
//   { id: 3, message: 'Wallet top-up successful: +5 ETH.' },
// ];

const Dashboard = () => {
  return (
    <DashBoardLayout>
      <div
        className='welcome-section text-center mb-8 rounded-lg p-6'
        style={{
          background:
            'radial-gradient(50% 206.8% at 50% 50%, rgba(10, 88, 116, 0.7) 0%, rgba(32, 23, 38, 0.7) 56.91%)',
        }}
      >
        <h1 className='font-poppins font-semibold text-3xl md:text-4xl leading-[170%] mb-2'>
          Welcome back, Kemsguy <span className='text-yellow-400'>👋</span>
        </h1>
        <p className='font-vietnam font-normal text-base leading-[170%] tracking-[1%] text-[hsl(var(--foreground)/0.7)]'>
          Let&apos;s find you a verified home in Lagos – safe, trusted, and scam-free!
        </p>
      </div>

      <div className='mb-10'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='font-poppins  font-semibold text-xl md:text-2xl'>Smart Recommendations</h2>
          <button className='text-sm font-vietnam text-white hover:underline hover:caret-blue-400 flex items-center'>
            View All
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 ml-1'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>

        {/* <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {propertyData.map((property) => (
            <DashBoardPropertyCard key={property.id} property={property} />
          ))}
        </div> */}
      </div>

      {/* <div className='mb-10'>
        <h2 className='font-poppins font-semibold text-xl md:text-2xl mb-6'>
          Your Saved Properties
        </h2>
        <div className='space-y-2'>
          {savedProperties.map((property) => (
            <SavedPropertyItem key={property.id} property={property} />
          ))}
        </div>

        <button className='mt-4 px-6 py-3 bg-gradient-to-r from-[hsl(var(--primary-from))] to-[hsl(var(--primary-to))] text-[hsl(var(--foreground))] rounded-3xl hover:opacity-90 transition text-sm font-medium'>
          View All Saved Homes
        </button>
      </div> */}

      {/* <div className='mb-10'>
        <h2 className='font-poppins font-semibold text-xl md:text-2xl mb-6'>Active Transactions</h2>
        <div className='bg-[hsl(var(--foreground)/0.05)] rounded-lg overflow-hidden border border-[hsl(var(--border))]'>
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead>
                <tr className='bg-[hsl(var(--transaction-table-header-background)/1)] border-b border-[hsl(var(--border))]'>
                  <th className='px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider'>
                    Property
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider'>
                    Amount (ETH)
                  </th>
                  <th className='px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionData.map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}

      {/* <div className='mb-10'>
        <h2 className='font-poppins font-semibold text-xl md:text-2xl mb-6'>
          Alerts & Notifications
        </h2>
        <div className='space-y-2'>
          {alertsData.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      </div> */}
    </DashBoardLayout>
  );
};

export default Dashboard;
