'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

const TokenTypesSlider = () => {
  const properties = [
    {
      id: 1,
      image: '/token-memecoin.png',
      style: 'Memecoins',
      name: 'Cosmic',
      features: 'Anti-whale, Liquidity Lock, Tax Configuration',
      verified: true,
      color: 'from-pink-400 to-purple-600',
      nameColor: 'from-pink-400 to-purple-600',
    },
    {
      id: 2,
      image: '/token-erc20.png',
      style: 'Standard ERC-20',
      name: 'Nexus',
      features: 'Mintable, Burnable, Pausable',
      verified: true,
      color: 'from-blue-400 to-blue-600',
      nameColor: 'from-blue-400 to-blue-600',
    },
    {
      id: 3,
      image: '/token-nft.png',
      style: 'ERC-721 NFTs',
      name: 'Quantum',
      features: 'Metadata Management, Royalty Configuration',
      verified: false,
      color: 'from-green-400 to-teal-600',
      nameColor: 'from-green-400 to-teal-600',
    },
    {
      id: 4,
      image: '/token-stablecoin.png',
      style: 'Stablecoins',
      name: 'Anchor',
      features: 'Collateralized, Reserve Management',
      verified: true,
      color: 'from-yellow-400 to-orange-600',
      nameColor: 'from-yellow-400 to-orange-600',
    },
  ];

  const [current, setCurrent] = useState(0);

  // Navigation functions (from old codebase)
  const nextSlide = () => {
    setCurrent(current === properties.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? properties.length - 1 : current - 1);
  };

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
    // }, [current]); //removed to fix error
  }); //removed to fix error

  return (
    <section className='py-10 px-6 md:px-12 lg:px-16 relative overflow-hidden bg-cover bg-center'>
      {/* Semi-transparent overlay (from old codebase) */}
      <div className='absolute inset-0 bg-[#3b026673] opacity-70'></div>

      {/* Main container (from old codebase, with z-index from new) */}
      <div className='max-w-7xl mx-auto px-4'>
        {/* Property Card with Slider (new UI styling) */}
        <div className='flex flex-col lg:flex-row bg-gradient-to-br from-[#2A1F32] to-[#231A29] rounded-2xl overflow-hidden max-w-5xl mx-auto shadow-xl border border-purple-500/20 backdrop-blur-sm'>
          {/* Left Section - Details (old structure, new UI) */}
          <div className='w-full lg:w-2/5 p-8 flex flex-col justify-center'>
            {/* Featured Tokens Heading */}
            <h2 className='text-2xl font-bold text-purple-300 mb-6 underline'>Featured Tokens</h2>
            {/* Property Details (new UI) */}
            <div className='space-y-6'>
              <div>
                <p className='text-purple-300 text-sm font-medium'>Token Type</p>
                <h3 className='text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300'>
                  {properties[current].style}
                </h3>
              </div>

              <div>
                <p className='text-purple-300 text-sm font-medium'>Token Name</p>
                <h3
                  className={`text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r ${properties[current].nameColor}`}
                >
                  {properties[current].name}
                </h3>
              </div>

              <div>
                <p className='text-purple-300 text-sm font-medium'>Key Features</p>
                <p
                  className={`text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r ${properties[current].color}`}
                >
                  {properties[current].features}
                </p>
              </div>

              {/* Web3 token indicator (new UI) */}
              <div className='flex items-center space-x-2 mt-4'>
                <div className='h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center'>
                  <span className='text-xs font-bold text-white'>Ξ</span>
                </div>
                <p className='text-sm text-gray-300'>One-click deployment</p>
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
              <ChevronLeft size={24} className='text-white' />
            </button>
            <button
              onClick={nextSlide}
              className='absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-purple-900/70 p-2 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10'
            >
              <ChevronRight size={24} className='text-white' />
            </button>

            {/* Image Slider (old structure, new UI elements) */}
            <div className='h-80 lg:h-full overflow-hidden relative'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={current}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className='h-full w-full flex items-center justify-center'
                >
                  <div
                    className={`relative h-full w-full flex items-center justify-center bg-gradient-to-r ${properties[current].color} opacity-50 backdrop-blur-sm`}
                  >
                    <Image
                      src={properties[current].image}
                      alt={`${properties[current].style} - ${properties[current].name}`}
                      className='object-contain'
                      width={400}
                      height={300}
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw'
                    />

                    {/* Verified Badge (new UI) */}
                    {properties[current].verified && (
                      <div className='absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full border border-purple-500/50 flex items-center justify-center z-20'>
                        <CheckCircle size={18} className='text-purple-400' />
                        <span className='ml-1 text-xs font-medium text-white'>AUDITED</span>
                      </div>
                    )}

                    {/* Property index indicator (new UI) */}
                    <div className='absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm py-1 px-3 rounded-full border border-white/20'>
                      <p className='text-sm text-white font-medium'>
                        {current + 1}/{properties.length}
                      </p>
                    </div>
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
                index === current
                  ? `w-8 bg-gradient-to-r ${properties[index].color}`
                  : 'w-2 bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TokenTypesSlider;
