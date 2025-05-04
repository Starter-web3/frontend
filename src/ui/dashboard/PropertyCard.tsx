import React from 'react';
import Image from 'next/image';
import propImg from '../../../public/heroBg.png';

interface Property {
  id: number;
  title: string;
  price: string;
  ethPrice: string;
  nairaPrice?: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  image: string | null;
  zone: string;
  verified: boolean;
}

const DashBoardPropertyCard = ({ property }: { property: Property }) => {
  const {
    title,
    price,
    ethPrice,
    nairaPrice,
    location,
    bedrooms,
    bathrooms,
    area,
    type,
    image,
    zone,
    verified,
  } = property;

  return (
    <div className='bg-[#201726] rounded-2xl overflow-hidden border border-[hsl(var(--border))] transition-transform hover:scale-[1.02] duration-300 property-card h-full flex flex-col shadow-[inset_0px_0px_10px_0px_rgba(255,255,255,0.1)] relative'>
      {/* Image container with fixed height */}
      <div className='relative h-48 w-full'>
        {/* Zone badge */}
        <div className='absolute top-3 left-3 bg-[rgba(255,255,255,0.8)] text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium z-10'>
          {zone}
        </div>

        {/* NEW badge */}
        <div className='absolute top-3 right-3 z-10'>
          <div className='bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full rotate-12 shadow-md'>
            NEW
          </div>
        </div>

        {/* Verified badge */}
        {verified && (
          <div className='absolute top-3 right-14 bg-blue-500 text-white p-1 rounded-full z-10'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        )}

        {/* Property Image */}
        {image ? (
          <Image
            src={propImg}
            alt={title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        ) : (
          <div className='relative h-full w-full bg-gray-800'>
            <Image
              src={propImg}
              alt='Property placeholder'
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        )}
      </div>

      {/* Content area */}
      <div className='p-4 flex flex-col flex-grow'>
        {/* Property title */}
        <h3 className='font-poppins font-semibold text-xl tracking-[0.05%] leading-tight mb-2'>
          {title}
        </h3>

        {/* Price information */}
        <p className='font-inter font-semibold text-base text-[#00B5F5] mb-3'>
          <span className='inline-flex items-center'>
            <svg
              className='w-4 h-4 mr-1'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 2L4 6V18L12 22L20 18V6L12 2Z'
                fill='currentColor'
                stroke='currentColor'
                strokeWidth='1.5'
              />
            </svg>
            {ethPrice} ETH / ${price} / ₦{nairaPrice}
          </span>
        </p>

        {/* Property features - spaced more evenly as per design */}
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-1 text-[hsl(var(--foreground)/0.5)]'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
            </svg>
            <span className='text-sm'>{bedrooms}</span>
          </div>

          <div className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-1 text-[hsl(var(--foreground)/0.5)]'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
            <span className='text-sm'>{bathrooms}</span>
          </div>

          <div className='flex items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4 mr-1 text-[hsl(var(--foreground)/0.5)]'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
                clipRule='evenodd'
              />
            </svg>
            <span className='text-sm'>{area} sqft</span>
          </div>

          <div className='bg-[hsl(var(--foreground)/0.1)] px-2 py-1 rounded-md text-xs font-medium'>
            {type}
          </div>
        </div>

        {/* Location and status - aligned horizontally as per design */}
        <div className='flex justify-between items-center mb-4'>
          <div className='text-sm text-[hsl(var(--foreground)/0.7)]'>{location}</div>

          {verified ? (
            <div className='bg-green-500 text-xs px-2 py-1 rounded-md text-white'>Verified</div>
          ) : (
            <div className='bg-yellow-500 text-xs px-2 py-1 rounded-md text-white'>Pending</div>
          )}
        </div>

        {/* View Details button - styled to match design */}
        <div className='mt-auto flex justify-end'>
          <button className='text-sm bg-[#2D033B] hover:bg-[#3B0764] px-4 py-2 rounded-lg text-white transition border border-[#4A044E]'>
            View Details
          </button>
        </div>
      </div>

      {/* Like button (heart icon) - positioned absolutely at bottom left */}
      <button className='absolute left-4 bottom-4 bg-[#f0e2f7] p-2 rounded-full hover:bg-gray-200 transition shadow-md'>
        <svg
          className='h-5 w-5 text-gray-700'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
          />
        </svg>
      </button>
    </div>
  );
};

export default DashBoardPropertyCard;
