import Image from 'next/image';
import { Star } from 'lucide-react';

export default function OwnerInformation() {
  return (
    <div className='bg-[#201726] p-4 border border-white-300 rounded-lg'>
      <h2 className='text-xl font-bold mb-3'>Owner&apos;s Information</h2>
      <div className='bg-[#201726] p-4 border border-white-300 rounded-lg'>
        <div className='flex items-center'>
          <div className='relative w-12 h-12 rounded-full overflow-hidden'>
            <Image
              src='/vercel.svg?height=100&width=100'
              alt='Owner profile'
              fill
              className='object-cover'
            />
          </div>
          <div className='ml-3'>
            <p className='font-semibold'>Frederick Doe</p>
            <div className='flex items-center'>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                ))}
              </div>
              <span className='text-sm text-gray-400 ml-1'>(4.9)</span>
            </div>
          </div>
          <button className='ml-auto bg-[#D1EAD7] hover:bg-[#D1EAD6] text-[#1F6E33]  px-3 py-1 rounded-md text-sm transition-colors'>
            Verified by Admin
          </button>
        </div>
      </div>
    </div>
  );
}
