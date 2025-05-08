'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

type HeaderProps = Record<string, never>;

const Header: React.FC<HeaderProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  if (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/propty-registration') ||
    pathname?.startsWith('/role-selection') ||
    pathname?.startsWith('/propty-access-denied')
  ) {
    return null;
  }

  return (
    <header className='fixed top-2 left-6 right-6 z-30'>
      <div className='backdrop-blur-sm bg-black/10 rounded-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center'>
              <Link href='/' className='flex-shrink-0'>
                <Image
                  src='/proptychain-logo.png'
                  alt='Logo'
                  width={120}
                  height={40}
                  className='object-contain'
                />
              </Link>
            </div>

            <nav className='hidden md:block'>
              <ul className='flex space-x-8'>
                {['Home', 'Community', 'Listings', 'About us'].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                      className='text-white hover:text-gray-300 transition'
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <appkit-button />
            </div>

            <div className='md:hidden'>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='text-white'
                type='button'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden bg-black/20 backdrop-blur-sm rounded-b-lg'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
              {['Home', 'Community', 'Listings', 'About us'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                  className='block px-3 py-2 text-white hover:bg-indigo-600 rounded-md'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
