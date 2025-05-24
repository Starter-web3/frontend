'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWallet } from '../../../contexts/WalletContext';
import toast from 'react-hot-toast';

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
            <span className="text-white font-medium text-sm">500+ satisfied clients</span>
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
  const { isConnected } = useWallet();

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
  // Handle connection status
  const handleGetStarted = () => {
    if (!isConnected) {
      console.error("Please connect your wallet first!");
      toast.error('Please connect your wallet first!', {
        position: 'top-center',
        duration: 4000,
      });
    }
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

        {/* Token/Crypto Icons */}
        {/* Token Icon (Top Left) */}
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
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#C44DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 22C3 17.0294 7.02944 13 12 13C16.9706 13 21 17.0294 21 22" stroke="#C44DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* NFT Icon (Bottom Left) */}
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
            <path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H5C4.44772 8 4 7.55228 4 7V5Z" stroke="#0AACE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 13C4 12.4477 4.44772 12 5 12H11C11.5523 12 12 12.4477 12 13V19C12 19.5523 11.5523 20 11 20H5C4.44772 20 4 19.5523 4 19V13Z" stroke="#0AACE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13C16 12.4477 16.4477 12 17 12H19C19.5523 12 20 12.4477 20 13V19C20 19.5523 19.5523 20 19 20H17C16.4477 20 16 19.5523 16 19V13Z" stroke="#0AACE6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Crypto Wallet Icon (Top Right) */}
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
            <path d="M19 7V5.5C19 4.83696 18.7366 4.20107 18.2678 3.73223C17.7989 3.26339 17.163 3 16.5 3H5.5C4.83696 3 4.20107 3.26339 3.73223 3.73223C3.26339 4.20107 3 4.83696 3 5.5V18.5C3 19.163 3.26339 19.7989 3.73223 20.2678C4.20107 20.7366 4.83696 21 5.5 21H16.5C17.163 21 17.7989 20.7366 18.2678 20.2678C18.7366 19.7989 19 19.163 19 18.5V17" stroke="#C44DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 11.55H21V15.45H16C15.6022 15.45 15.2206 15.292 14.9393 15.0107C14.658 14.7294 14.5 14.3478 14.5 13.95V13.05C14.5 12.6522 14.658 12.2706 14.9393 11.9893C15.2206 11.708 15.6022 11.55 16 11.55Z" stroke="#C44DFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>

        {/* Smart Contract Icon (Bottom Right) */}
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
              <span className='mr-2 text-xs uppercase tracking-wider'>No-Code Platform</span>
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
              Deploy Tokens & NFTs <br />
              Without Writing Code
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className='text-gray-300 text-lg max-w-xl mx-auto leading-tight'
            variants={itemVariants}
          >
            The complete platform for token creation, airdrops, and campaign management, all on the blockchain with Web3 simplicity.
          </motion.p>

          {/* Call to action buttons with hover effects */}
          <motion.div 
            className='flex flex-col sm:flex-row justify-center gap-4 mt-6'
            variants={itemVariants}
          >
           {isConnected ? (
              <Link href='/role-selection'>
                <motion.button
                  className='bg-gradient-to-r from-[#C44DFF] to-[#0AACE6] text-white font-semibold text-sm rounded-full w-full sm:w-[138px] h-[40px] px-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </Link>
            ) : (
              <motion.button
                onClick={handleGetStarted}
                className='bg-gradient-to-r from-[#C44DFF] to-[#0AACE6] text-white font-semibold text-sm rounded-full w-full sm:w-[138px] h-[40px] px-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            )}

            <Link href='/listings'>
              <motion.button
                className='border border-white text-white font-semibold text-sm rounded-full w-full sm:w-[138px] h-[40px] px-5 transition-all duration-300 backdrop-blur-sm hover:bg-white/10 hover:border-blue-400'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                View Listings
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