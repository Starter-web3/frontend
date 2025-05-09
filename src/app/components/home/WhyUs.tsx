'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

// Define props interface
type WhyUsProps = Record<string, never>;

// Define a type for the card data
interface CardData {
  icon: ReactNode;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

const WhyUs: React.FC<WhyUsProps> = () => {
  // Define the card data
  const cards: CardData[] = [
    {
      icon: (
        <svg
          className='w-6 h-6 text-white'
          fill='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.2L4 17.2V4H20V16Z' />
        </svg>
      ),
      title: 'No-Code Simplicity',
      description:
        'Deploy tokens and manage campaigns with ease - no blockchain development expertise required.',
      gradientFrom: '#C44DFF',
      gradientTo: '#9A00FF',
    },
    {
      icon: (
        <svg
          className='w-6 h-6 text-white'
          fill='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z' />
        </svg>
      ),
      title: 'Complete Ecosystem',
      description:
        'From token creation to airdrops and marketing campaigns - manage your entire token lifecycle in one unified platform.',
      gradientFrom: '#0AACE6',
      gradientTo: '#0080FF',
    },
    {
      icon: (
        <svg
          className='w-6 h-6 text-white'
          fill='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM12 17.75C11.45 17.75 11 17.3 11 16.75V14.25C11 13.7 11.45 13.25 12 13.25C12.55 13.25 13 13.7 13 14.25V16.75C13 17.3 12.55 17.75 12 17.75ZM13 12H11V10H13V12Z' />
        </svg>
      ),
      title: 'Multiple Token Standards',
      description:
        'Deploy ERC-20, ERC-721, ERC-1155, memecoins, and stablecoins with specialized templates and configuration options.',
      gradientFrom: '#00C2FF',
      gradientTo: '#0AACE6',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80 },
    },
  };

  return (
    <section className='py-20 bg-[#16091D] relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute top-0 left-0 right-0 bottom-0 overflow-hidden opacity-20'>
        <div className='absolute top-10 left-10 w-40 h-40 rounded-full bg-purple-700 blur-[100px]'></div>
        <div className='absolute bottom-10 right-20 w-60 h-60 rounded-full bg-blue-700 blur-[120px]'></div>
      </div>

      <div className='max-w-7xl mx-auto px-4 relative z-10'>
        <motion.div 
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className='inline-block mb-4'>
            <div className='bg-gray-800/80 backdrop-blur-md text-white text-sm py-1 px-4 rounded-full flex items-center border border-gray-700'>
              <span className='mr-2 text-xs uppercase tracking-wider font-medium'>Token Platform</span>
              <div className='bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center'>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3L5.5 8.5L3 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          <h2
            className='text-4xl font-semibold bg-clip-text text-transparent mb-4'
            style={{
              background: 'linear-gradient(275.69deg, #C44DFF 25.22%, #0AACE6 75.5%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Choose StrataForge?
          </h2>
          
          <p className='text-gray-300 max-w-2xl mx-auto'>
            Our no-code platform brings trust, transparency, and efficiency to token deployment and campaign management.
          </p>
        </motion.div>

        <motion.div 
          className='grid grid-cols-1 md:grid-cols-3 gap-8'
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {cards.map((card, index) => (
            <motion.div 
              key={index} 
              className='bg-[#1E1425] rounded-xl p-6 flex flex-col backdrop-blur-sm border border-white/5 hover:border-purple-500/20 transition-all duration-300 group'
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div 
                className='rounded-full w-12 h-12 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300'
                style={{
                  background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})`,
                }}
              >
                {card.icon}
              </div>
              
              <h3 className='text-white font-medium text-xl mb-3'>{card.title}</h3>
              
              <p className='text-gray-400 text-sm leading-relaxed'>{card.description}</p>
              
              <div className='mt-6 pt-4 border-t border-gray-700/30 flex justify-between items-center'>
                <div className='text-xs text-gray-500'>Web3 verified</div>
                <motion.div 
                  className='w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center'
                  whileHover={{ scale: 1.2, rotate: 90 }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2V10M2 6H10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;