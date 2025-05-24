import Link from 'next/link';
import { Button } from '../../../../components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Header() {
  return (
    <header
      className='sticky top-0 z-50 bg-[#16091D] backdrop-blur-sm border-b border-gray-800'
      // <header className="sticky top-0 z-50 bg-gray-800 hover:bg-gray-700 transition-colors backdrop-blur-sm border-b border-gray-800"
      // style={{
      //   backgroundImage: "url('/property-image/PropertyHeader.png')",
      // }}
    >
      <div className='container mx-auto px-4 max-w-6xl flex justify-between items-center h-16'>
        <Link
          href='/listings'
          className='flex items-center text-sm text-gray-400 hover:text-white transition-colors'
        >
          <ArrowLeft className='w-4 h-4 mr-1' />
          Back to Search
        </Link>

        <Link href='/listings'>
          <Button
            className='flex items-center justify-center text-white px-4 py-2 rounded-full'
            style={{
              background: 'linear-gradient(90deg, #0AA5E6 0%, #9B4FE9 100%)',
              boxShadow: '0 2px 8px rgba(10, 165, 230, 0.3)',
              minWidth: '160px',
              height: '45px',
              border: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* NFT ID: #{nftId} */}
            NFT ID: #Nft1234
          </Button>
        </Link>
      </div>
    </header>
  );
}
