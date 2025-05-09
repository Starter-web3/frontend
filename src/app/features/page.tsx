"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type HeaderProps = Record<string, never>;

// Define the CSS animation styles
const styles = `
  @keyframes gradientBorder {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 300% 50%;
    }
  }

  .border-gradient {
    position: relative;
    z-index: 0;
    overflow: hidden;
  }

  .border-gradient-animation {
    content: '';
    position: absolute;
    z-index: -1;
    inset: -1.5px; /* Slightly thinner border */
    border-radius: inherit;
    padding: 1.5px;
    background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0.2), /* More subtle blue */
      rgba(147, 51, 234, 0.2), /* More subtle purple */
      rgba(236, 72, 153, 0.2), /* More subtle pink */
      rgba(37, 99, 235, 0.2), /* Another blue shade */
      rgba(147, 51, 234, 0.2)  /* Loop back to purple */
    );
    background-size: 300% 300%;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: gradientBorder 12s linear infinite; /* Slower, more subtle animation */
    filter: blur(1.5px); /* Slight blur for glow effect */
    opacity: 0.6; /* More subtle opacity */
    box-shadow: 0 0 8px rgba(114, 137, 218, 0.15); /* Subtle glow */
  }
`;

// Component to inject styles into the document
const HeaderStyles = () => {
  useEffect(() => {
    // Add styles to document
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return null;
};

const Header: React.FC<HeaderProps> = () => {
  // Render the styles component
  HeaderStyles();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  if (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/token-creation') ||
    pathname?.startsWith('/role-selection') ||
    pathname?.startsWith('/access-denied')
  ) {
    return null;
  }

  return (
    <header className='fixed top-2 left-6 right-6 z-30'>
      <div className='backdrop-blur-sm bg-black/10 rounded-lg relative border-gradient'>
        <div className="absolute inset-0 rounded-lg border-gradient-animation"></div>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center'>
              <Link href='/' className='flex-shrink-0'>
                <Image
                  src='/strataforge-logo.png'
                  alt='StrataForge Logo'
                  width={120}
                  height={40}
                  className='object-contain'
                />
              </Link>
            </div>

            <nav className='hidden md:block'>
              <ul className='flex space-x-8'>
                {['Home', 'Features', 'Pricing', 'About us'].map((item) => (
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
              {['Home', 'Features', 'Pricing', 'About us'].map((item) => (
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