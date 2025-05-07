import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, text, active }) => {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 ${
        active ? 'bg-[hsl(var(--foreground)/0.1)]' : 'hover:bg-[hsl(var(--foreground)/0.05)]'
      } transition-colors rounded-lg my-1`}
    >
      <div className='w-6 h-6 mr-3 flex items-center justify-center'>{icon}</div>
      <span className='font-inter font-normal text-base leading-[25px]'>{text}</span>
    </Link>
  );
};

const DashboardSidebar = () => {
  const pathname = usePathname(); // Get current path
  const currentPath = pathname || '/dashboard'; // Fallback to '/dashboard'

  return (
    <aside className='w-64 h-auto min-h-2/5 transition-transform duration-300 ease-in-out'>
      {/* Content wrapper with border and shadow styling */}
      <div className='h-full   inset-shadow-[0px_0px_10px_0px_hsl(var(--foreground)/0.25)] backdrop-blur-[30px] bg-[#201726] flex flex-col'>
        <div className='p-4 flex flex-col h-full'>
          <div className='flex items-center mb-8'>
            <div className='text-xl font-bold flex items-center'>
              <span className='text-[hsl(var(--primary-from))] mr-1'>Strata</span>
              <span className='text-[hsl(var(--foreground))]'>Forge</span>
            </div>
          </div>

          <div className='flex items-center gap-2 mb-8 px-4'>
            <div className='w-8 h-8 rounded-full bg-gray-400 overflow-hidden'>
              {/* User avatar could be here */}
            </div>
            <span className='font-inter'>Property Seeker</span>
          </div>

          <nav className='space-y-1 flex-grow'>
            <SidebarLink
              href='/dashboard'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z' />
                  <path d='M3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z' />
                </svg>
              }
              text='Dashboard'
              active={currentPath === '/dashboard'}
            />
            <SidebarLink
              href='/listings'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                    clipRule='evenodd'
                  />
                </svg>
              }
              text='Find Properties'
              active={currentPath === '/find-properties'}
            />
            <SidebarLink
              href='/dashboard/create-listing'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z' />
                </svg>
              }
              text='Create Listings'
              active={currentPath === '/create-listing'}
            />
            <SidebarLink
              href='/dashboard/propertynft'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                  <path
                    fillRule='evenodd'
                    d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
                    clipRule='evenodd'
                  />
                </svg>
              }
              text='Create Property NFT'
              active={currentPath === '/propertynft'}
            />
            <SidebarLink
              href='/dashboard/deposit'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
                  <path
                    fillRule='evenodd'
                    d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
                    clipRule='evenodd'
                  />
                </svg>
              }
              text='Escrow Transactions'
              active={currentPath === '/dashboard/deposit'}
            />
            <SidebarLink
              href='/dashboard/airdrop-listing'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z'
                    clipRule='evenodd'
                  />
                </svg>
              }
              text='Token Wallet'
              active={currentPath === '/wallet'}
            />
            <SidebarLink
              href='/profile'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                    clipRule='evenodd'
                  />
                </svg>
              }
              text='My Profile'
              active={currentPath === '/profile'}
            />
            <SidebarLink
              href='/hub'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
                </svg>
              }
              text='Hub (Coming Soon)'
              active={currentPath === '/hub'}
            />
          </nav>

          <div className='mt-auto pt-4'>
            <SidebarLink
              href='/support'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
                    clipRule='evenodd'
                  />
                </svg>
              }
              text='Help & Support'
              active={currentPath === '/support'}
            />
            <SidebarLink
              href='/logout'
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm1 2v10h10V5H4zm4 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              }
              text='Log Out'
              active={currentPath === '/logout'}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
