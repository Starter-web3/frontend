'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const PropertyCardSlider = () => {
  const properties = [
    {
      id: 1,
      image: '/bedroom.png',
      style: 'Minimalist, Modern',
      location: '1, Igbagbo Ikorodu, Lagos.',
      price: '$364.19',
      verified: true, // Added for new UI
    },
    {
      id: 2,
      image: '/luxruy1.jpeg',
      style: 'Contemporary, Urban',
      location: '15, Victoria Island, Lagos.',
      price: '$425.50',
      verified: true, // Added for new UI
    },
    {
      id: 3,
      image: '/luxury3.jpeg',
      style: 'Traditional, Elegant',
      location: '8, Lekki Phase 1, Lagos.',
      price: '$392.75',
      verified: false, // Added for new UI
    },
    {
      id: 4,
      image: '/luxury4.jpeg',
      style: 'Traditional, Elegant',
      location: '8, Selewu Igbobo Ikorodu, Lagos.',
      price: '$823.21',
      verified: true, // Added for new UI
    },
  ];

  const [current, setCurrent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation functions (from old codebase)
  const nextSlide = () => {
    setCurrent(current === properties.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? properties.length - 1 : current - 1);
  };

  // Search handler (from old codebase)
  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement actual search functionality here
  };

  return (
    <section className='py-10 px-6 md:px-12 lg:px-16 relative overflow-hidden bg-cover bg-center'>
      {/* Semi-transparent overlay (from old codebase) */}
      <div className='absolute inset-0 bg-[#3b026673] opacity-70'></div>

      {/* Main container (from old codebase, with z-index from new) */}
        <div className='max-w-7xl mx-auto px-4'>
          {/* Property Card with Slider (new UI styling) */}
          <div className='flex flex-col lg:flex-row bg-gradient-to-br from-[#2A1F32] to-[#231A29] rounded-2xl overflow-hidden max-w-5xl mx-auto shadow-xl border border-purple-500/20 backdrop-blur-sm'>
            {/* Left Section - Search and Details (old structure, new UI) */}
            <div className='w-full lg:w-2/5 p-8 flex flex-col justify-between'>
              {/* Search Form (new UI) */}
              <form onSubmit={handleSearch} className='mb-8'>
                <div className='relative flex items-center'>
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full bg-[#1E1625] text-white rounded-full py-3 pl-6 pr-12 outline-none border border-purple-500/30 focus:border-purple-400 transition-all duration-300 shadow-inner shadow-purple-900/20'
                  />
                  <button
                    type='submit'
                    className='absolute right-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-3 mr-1 shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300'
                  >
                    <Search size={18} className="text-white" />
                  </button>
                </div>
              </form>

              {/* Property Details (new UI) */}
              <div className='space-y-6 mt-auto'>
                <div>
                  <p className='text-purple-300 text-sm font-medium'>Style</p>
                  <h3 className='text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300'>{properties[current].style}</h3>
                </div>

                <div className='flex items-start space-x-2'>
                  <div className='text-purple-400'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className="drop-shadow-md"
                    >
                      <path
                        d='M12 13.5C13.933 13.5 15.5 11.933 15.5 10C15.5 8.067 13.933 6.5 12 6.5C10.067 6.5 8.5 8.067 8.5 10C8.5 11.933 10.067 13.5 12 13.5Z'
                        stroke='currentColor'
                        strokeWidth='1.5'
                      />
                      <path
                        d='M3.62001 8.49C5.59001 -0.169998 18.42 -0.159998 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z'
                        stroke='currentColor'
                        strokeWidth='1.5'
                      />
                    </svg>
                  </div>
                  <div>
                    <p className='text-purple-300 text-sm font-medium'>Location</p>
                    <p className='text-gray-200'>{properties[current].location}</p>
                  </div>
                </div>

                <div>
                  <p className='text-purple-300 text-sm font-medium'>Price</p>
                  <p className='text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400'>{properties[current].price}</p>
                </div>

                {/* Web3 token indicator (new UI) */}
                <div className='flex items-center space-x-2 mt-4'>
                  <div className='h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center'>
                    <span className='text-xs font-bold text-white'>Ξ</span>
                  </div>
                  <p className='text संप-sm text-gray-300'>NFT-backed property</p>
                </div>
              </div>
            </div>

            {/* Right Section - Image Slider (old structure, new UI) */}
            <div className='w-full lg:w-3/5 relative'>
              {/* Navigation Arrows (new UI) */}
              <button
                onClick={prevSlide}
                className='absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-purple-900/70 p-2 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10'
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={nextSlide}
                className='absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-purple-900/70 p-2 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10'
              >
                <ChevronRight size={24} className="text-white" />
              </button>

              {/* Image Slider (old structure, new UI elements) */}
              <div className='h-80 lg:h-full overflow-hidden'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className='h-full w-full relative'
                  >
                    <Image
                      src={properties[current].image}
                      alt={`Property ${current + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw'
                    />

                    {/* Verified Badge (new UI) */}
                    {properties[current].verified && (
                      <div className='absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full border border-purple-500/50 flex items-center justify-center z-20'>
                        <CheckCircle size={18} className="text-purple-400" />
                        <span className='ml-1 text-xs font-medium text-white'>VERIFIED</span>
                      </div>
                    )}

                    {/* Image overlay gradient (new UI) */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70'></div>

                    {/* Property index indicator (new UI) */}
                    <div className='absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm py-1 px-3 rounded-full border border-white/20'>
                      <p className='text-sm text-white font-medium'>{current + 1}/{properties.length}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Slide Indicators (new UI) */}
          <div className='flex justify-center mt-6 space-x-2'>
            {properties.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500' : 'w-2 bg-white/30'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
    </section>
  );
};

export default PropertyCardSlider;