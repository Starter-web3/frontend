// 'use client';
// import React, { useState, ReactNode } from 'react';
// import DashboardSidebar from './Sidebar';
// import DashboardHeader from './Header';
// import Footer from '../components/layout/Footer';
// export default function DashboardLayout({ children }: { children: ReactNode }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   return (
//     <>
//       <div className='flex flex-col md:flex-row min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-inter'>
//         {/* Mobile sidebar backdrop */}
//         {sidebarOpen && (
//           <div
//             className='fixed inset-0 bg-black/50 z-40 md:hidden'
//             onClick={() => setSidebarOpen(false)}
//           ></div>
//         )}

//         {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
//         <div
//           className={`fixed md:relative inset-y-0 left-0 transform ${
//             sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } md:translate-x-0 transition duration-200 ease-in-out z-50 md:z-0`}
//         >
//           <DashboardSidebar />
//         </div>

//         <div className='flex-1 flex flex-col min-h-screen'>
//           <DashboardHeader toggleSidebar={toggleSidebar} />
//           <main className='flex-1 p-4 md:p-8 overflow-auto'>{children}</main>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }

'use client';
import React, { useState, ReactNode } from 'react';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import Footer from '../components/layout/Footer';
import { useWallet } from '../../contexts/WalletContext'; // Import the hook

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected } = useWallet(); // Get connection status

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className='flex flex-col md:flex-row min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-inter'>
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className='fixed inset-0 bg-black/50 z-40 md:hidden'
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
        <div
          className={`fixed md:relative inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition duration-200 ease-in-out z-50 md:z-0`}
        >
          <DashboardSidebar />
        </div>

        <div className='flex-1 flex flex-col min-h-screen'>
          <DashboardHeader toggleSidebar={toggleSidebar} isConnected={isConnected} />
          <main className='flex-1 p-4 md:p-8 overflow-auto'>
            {!isConnected ? (
              <div className='text-center p-8'>
                <p>Please connect your wallet to access the dashboard</p>
                <button onClick={() => document.querySelector('appkit-button')?.click()}>
                  Connect Wallet
                </button>
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
