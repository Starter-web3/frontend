'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Minimal review component (now static, not clickable or expandable)
const ReviewMinimal: React.FC = () => {
  return (
    <div className="relative">
      <motion.div 
        className="flex items-center bg-gray-800/60 rounded-full pl-2 pr-6 py-2 border border-purple-500/30 backdrop-blur-sm"
        animate={{
          boxShadow: [
            '0 0 0 rgba(196, 77, 255, 0)',
            '0 0 10px rgba(196, 77, 255, 0.2)',
            '0 0 0 rgba(196, 77, 255, 0)'
          ]
        }}
        transition={{
          boxShadow: {
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }
        }}
      >
        {/* Overlapping profile circles */}
        <div className="flex -space-x-3 mr-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/90 to-purple-500/90 flex items-center justify-center border-2 border-gray-800/60 z-30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 20C18 17.7909 15.3137 16 12 16C8.68629 16 6 17.7909 6 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 flex items-center justify-center border-2 border-gray-800/60 z-20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 20C18 17.7909 15.3137 16 12 16C8.68629 16 6 17.7909 6 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/90 to-blue-500/90 flex items-center justify-center border-2 border-gray-800/60 z-10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 20C18 17.7909 15.3137 16 12 16C8.68629 16 6 17.7909 6 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {/* Review text */}
        <div className="text-left">
          <div className="flex items-center">
            <span className="text-white font-medium text-sm">500+ positive reviews</span>
            <div className="ml-2 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width="10" height="10" viewBox="0 0 24 24" fill="#C44DFF" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

type HeroProps = Record<string, never>;

const Hero: React.FC<HeroProps> = () => {
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <section
      className='pt-36 pb-20 px-6 md:px-12 lg:px-16 relative overflow-hidden bg-cover bg-center'
      style={{
        backgroundImage: "url('/backround.png')",
      }}
    >
      {/* Animated gradient overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-[#170129]/90 via-[#170129]/70 to-[#170129]/90'></div>
      
      {/* Web3 Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Blockchain grid pattern */}
        <div className='absolute inset-0 opacity-10 bg-[radial-gradient(#C44DFF_1px,transparent_1px)] bg-[size:20px_20px]'></div>
        
        {/* Floating blockchain elements */}
        <motion.div 
          className='absolute w-40 h-40 rounded-full bg-[#C44DFF]/10 border border-purple-500/20 top-20 left-[10%] backdrop-blur-sm'
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              '0 0 0 rgba(196, 77, 255, 0)',
              '0 0 20px rgba(196, 77, 255, 0.3)',
              '0 0 0 rgba(196, 77, 255, 0)'
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        
        <motion.div 
          className='absolute w-64 h-64 rounded-full bg-[#0AACE6]/5 border border-blue-400/10 bottom-10 right-[5%] backdrop-blur-sm'
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.4, 0.2],
            boxShadow: [
              '0 0 0 rgba(10, 172, 230, 0)',
              '0 0 30px rgba(10, 172, 230, 0.2)',
              '0 0 0 rgba(10, 172, 230, 0)'
            ]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        
        {/* Blockchain nodes and connections */}
        <motion.div 
          className='absolute flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/30 to-blue-500/30 top-1/4 left-[20%] backdrop-blur-sm'
          animate={{
            rotate: [0, 45, 0],
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 0 rgba(196, 77, 255, 0)',
              '0 0 15px rgba(196, 77, 255, 0.5)',
              '0 0 0 rgba(196, 77, 255, 0)'
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <div className='w-4 h-4 rounded-full bg-white/80'></div>
        </motion.div>
        
        <motion.div 
          className='absolute flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/30 to-cyan-400/30 top-2/3 right-[30%] backdrop-blur-sm'
          animate={{
            rotate: [0, -30, 0],
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 0 rgba(10, 172, 230, 0)',
              '0 0 15px rgba(10, 172, 230, 0.5)',
              '0 0 0 rgba(10, 172, 230, 0)'
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.5
          }}
        >
          <div className='w-3 h-3 rounded-full bg-white/80'></div>
        </motion.div>
        
        {/* Connection lines */}
        <svg className='absolute inset-0 w-full h-full opacity-20' xmlns="http://www.w3.org/2000/svg">
          <motion.line 
            x1="20%" 
            y1="25%" 
            x2="70%" 
            y2="67%" 
            stroke="url(#web3-gradient)" 
            strokeWidth="1"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          <defs>
            <linearGradient id="web3-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C44DFF" />
              <stop offset="100%" stopColor="#0AACE6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Glowing rings - NFT symbols */}
        <motion.div 
          className='absolute w-32 h-32 border-2 border-cyan-400/30 rounded-full top-40 right-[15%]'
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2],
            boxShadow: [
              '0 0 0 rgba(10, 172, 230, 0)',
              '0 0 20px rgba(10, 172, 230, 0.3)',
              '0 0 0 rgba(10, 172, 230, 0)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Housing/Real Estate Icons */}
        {/* House Icon (Top Left) */}
        <motion.div 
          className='absolute flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 top-10 left-[15%] backdrop-blur-sm'
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              '0 0 0 rgba(196, 77, 255, 0)',
              '0 0 15px rgba(196, 77, 255, 0.3)',
              '0 0 0 rgba(196, 77, 255, 0)'
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#C44DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="#C44DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Key Icon (Bottom Left) */}
        <motion.div 
          className='absolute flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-400/20 bottom-20 left-[25%] backdrop-blur-sm'
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              '0 0 0 rgba(10, 172, 230, 0)',
              '0 0 15px rgba(10, 172, 230, 0.3)',
              '0 0 0 rgba(10, 172, 230, 0)'
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.2
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 2L19 4M19 4L15 8M19 4L22 7M15 8C15.296 7.33762 15.4435 6.61754 15.4288 5.89236C15.4141 5.16717 15.2376 4.45466 14.9137 3.80496C14.5898 3.15526 14.127 2.58427 13.5639 2.13739C13.0008 1.6905 12.3519 1.37839 11.6709 1.22144C10.9899 1.06449 10.2934 1.06654 9.61329 1.22753C8.93315 1.38853 8.28646 1.70488 7.726 2.15477C7.16554 2.60466 6.70581 3.1782 6.38447 3.83051C6.06312 4.48281 5.88885 5.19722 5.874 5.923L2 9.848C1.69949 10.1491 1.48782 10.5269 1.38818 10.9365C1.28854 11.346 1.30446 11.7739 1.434 12.176L1.858 13.414C1.98195 13.8007 2.19801 14.1517 2.48811 14.4375C2.77821 14.7233 3.13442 14.936 3.524 15.06L5.149 15.584C5.53987 15.7083 5.95798 15.7244 6.36085 15.6308C6.76372 15.5372 7.13737 15.3372 7.446 15.048L15 8Z" stroke="#0AACE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Building Icon (Top Right) */}
        <motion.div 
          className='absolute flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 top-1/3 right-[10%] backdrop-blur-sm'
          animate={{
            y: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              '0 0 0 rgba(196, 77, 255, 0)',
              '0 0 15px rgba(196, 77, 255, 0.3)',
              '0 0 0 rgba(196, 77, 255, 0)'
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.4
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21H21M6 21V6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4H16C16.5304 4 17.0391 4.21071 17.4142 4.58579C17.7893 4.96086 18 5.46957 18 6V21M9 9H10M9 13H10M9 17H10M14 9H15M14 13H15M14 17H15" stroke="#C44DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Contract/Document Icon (Bottom Right) */}
        <motion.div 
          className='absolute flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-400/20 bottom-1/4 right-[20%] backdrop-blur-sm'
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3],
            boxShadow: [
              '0 0 0 rgba(10, 172, 230, 0)',
              '0 0 15px rgba(10, 172, 230, 0.3)',
              '0 0 0 rgba(10, 172, 230, 0)'
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: 0.6
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#0AACE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="#0AACE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8" stroke="#0AACE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17H8" stroke="#0AACE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H9" stroke="#0AACE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>

      <div className='max-w-7xl mx-auto flex justify-center relative z-10'>
        <motion.div 
          className='text-white space-y-6 text-center max-w-2xl'
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Web3 badge with enhanced glow effect */}
          <motion.div className='flex justify-center mb-6' variants={itemVariants}>
            <motion.div 
              className='bg-gray-800/60 text-white text-sm py-2 px-4 rounded-full flex items-center border border-gray-700 backdrop-blur-sm'
              animate={{
                boxShadow: [
                  '0 0 0 rgba(196, 77, 255, 0)',
                  '0 0 10px rgba(196, 77, 255, 0.3)',
                  '0 0 0 rgba(196, 77, 255, 0)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <span className='mr-2 text-xs uppercase tracking-wider'>Web3 Powered</span>
              <div className='bg-gradient-to-r from-[#C44DFF] to-[#0AACE6] rounded-full w-5 h-5 flex items-center justify-center'>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3L5.5 8.5L3 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>
          </motion.div>

          {/* Main heading with enhanced gradient text effect */}
          <motion.h1 
            className='font-poppins font-medium text-4xl md:text-5xl lg:text-[47px] leading-[115%] tracking-[-2.5px] text-center'
            variants={itemVariants}
          >
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-blue-300'>
              Unlock Nigerias Housing Market <br />
              with Web3 Transparency.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className='text-gray-300 text-lg max-w-xl mx-auto leading-tight'
            variants={itemVariants}
          >
            Buy, rent, or sell with NFT-verified listings, trusted agents, and secure escrow—all on transparent smart contracts.
          </motion.p>

          {/* Call to action buttons with hover effects */}
          <motion.div 
            className='flex flex-col sm:flex-row justify-center gap-4 mt-6'
            variants={itemVariants}
          >
            <Link href='/role-selection'>
              <motion.button
                className='bg-gradient-to-r from-[#C44DFF] to-[#0AACE6] text-white font-semibold text-sm rounded-full w-full sm:w-[138px] h-[40px] px-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </Link>

            <Link href='/seeker-dashboard'>
              <motion.button
                className='border border-white text-white font-semibold text-sm rounded-full w-full sm:w-[138px] h-[40px] px-5 transition-all duration-300 backdrop-blur-sm hover:bg-white/10 hover:border-blue-400'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Waitlist
              </motion.button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            className='flex justify-center mt-16 opacity-80'
            initial={{ opacity: 0 }}
            animate={{ opacity: scrollY > 50 ? 0 : 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className='w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1'
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <motion.div 
                className='w-1 h-2 bg-white/80 rounded-full'
                animate={{
                  y: [0, 5, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </motion.div>
          </motion.div>

          {/* Static Review section */}
          <motion.div 
            className='mt-16 flex justify-center'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <ReviewMinimal />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;