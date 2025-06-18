'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useWallet } from '../../../contexts/WalletContext';
import toast from 'react-hot-toast';

// Minimal review component with enhanced futuristic styling
const ReviewMinimal: React.FC = () => {
  return (
    <div className="relative">
      <motion.div 
        className="flex items-center bg-black/40 rounded-full pl-3 pr-6 py-3 border border-purple-400/50 backdrop-blur-md"
        animate={{
          boxShadow: [
            '0 0 0 rgba(139, 69, 255, 0)',
            '0 0 20px rgba(139, 69, 255, 0.4)',
            '0 0 0 rgba(139, 69, 255, 0)'
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
        {/* Overlapping profile circles with enhanced glow */}
        <div className="flex -space-x-3 mr-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center border-2 border-black/60 z-30 shadow-lg shadow-purple-500/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 20C18 17.7909 15.3137 16 12 16C8.68629 16 6 17.7909 6 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center border-2 border-black/60 z-20 shadow-lg shadow-purple-500/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 20C18 17.7909 15.3137 16 12 16C8.68629 16 6 17.7909 6 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center border-2 border-black/60 z-10 shadow-lg shadow-blue-500/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 20C18 17.7909 15.3137 16 12 16C8.68629 16 6 17.7909 6 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        {/* Review text with enhanced styling */}
        <div className="text-left">
          <div className="flex items-center">
            <span className="text-white font-medium text-sm">500+ satisfied clients</span>
            <div className="ml-3 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill="#8B45FF" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
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
    <section className='min-h-screen pt-20 pb-20 px-6 md:px-12 lg:px-16 relative overflow-hidden bg-black'>
      {/* Main Background with Starfield Effect */}
      <div className='absolute inset-0 bg-black'>
        {/* Starfield background */}
        <div className='absolute inset-0 opacity-60'>
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute w-1 h-1 bg-white rounded-full'
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlays for depth */}
        <div className='absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black'></div>
        <div className='absolute inset-0 bg-gradient-to-r from-black via-transparent to-black'></div>
      </div>
      
      {/* Futuristic Geometric Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        {/* Large Central Geometric Shape - Main Focus */}
        <motion.div 
          className='absolute right-[10%] top-1/2 transform -translate-y-1/2 w-96 h-96'
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Outer hexagonal ring */}
          <motion.div 
            className='absolute inset-0 border-2 border-purple-400/30 backdrop-blur-sm'
            style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            }}
            animate={{
              boxShadow: [
                '0 0 0 rgba(139, 69, 255, 0)',
                '0 0 40px rgba(139, 69, 255, 0.4)',
                '0 0 80px rgba(139, 69, 255, 0.6)',
                '0 0 40px rgba(139, 69, 255, 0.4)',
                '0 0 0 rgba(139, 69, 255, 0)',
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
          
          {/* Inner glowing core */}
          <motion.div 
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-purple-400/50'
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -360],
              boxShadow: [
                '0 0 20px rgba(139, 69, 255, 0.3)',
                '0 0 40px rgba(139, 69, 255, 0.6)',
                '0 0 20px rgba(139, 69, 255, 0.3)',
              ]
            }}
            transition={{
              scale: { duration: 3, repeat: Infinity, repeatType: 'reverse' },
              rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
              boxShadow: { duration: 2, repeat: Infinity, repeatType: 'reverse' },
            }}
          />
          
          {/* Orbital elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg'
              style={{
                left: `${50 + 40 * Math.cos((i * 60) * Math.PI / 180)}%`,
                top: `${50 + 40 * Math.sin((i * 60) * Math.PI / 180)}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                boxShadow: [
                  '0 0 5px rgba(139, 69, 255, 0.5)',
                  '0 0 15px rgba(139, 69, 255, 0.8)',
                  '0 0 5px rgba(139, 69, 255, 0.5)',
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>

        {/* Secondary Floating Elements */}
        <motion.div 
          className='absolute left-[15%] top-[20%] w-24 h-24 border border-blue-400/40 backdrop-blur-sm'
          style={{
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 0],
            boxShadow: [
              '0 0 0 rgba(59, 130, 246, 0)',
              '0 0 20px rgba(59, 130, 246, 0.4)',
              '0 0 0 rgba(59, 130, 246, 0)'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        <motion.div 
          className='absolute right-[25%] bottom-[25%] w-16 h-16 border border-purple-400/40 backdrop-blur-sm'
          style={{
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          }}
          animate={{
            x: [0, 15, 0],
            rotate: [0, -120, 0],
            boxShadow: [
              '0 0 0 rgba(139, 69, 255, 0)',
              '0 0 15px rgba(139, 69, 255, 0.4)',
              '0 0 0 rgba(139, 69, 255, 0)'
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        <motion.div 
          className='absolute left-[8%] bottom-[15%] w-20 h-20 border border-cyan-400/40 backdrop-blur-sm rounded-full'
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              '0 0 0 rgba(34, 211, 238, 0)',
              '0 0 25px rgba(34, 211, 238, 0.4)',
              '0 0 0 rgba(34, 211, 238, 0)'
            ]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Connection Lines */}
        <svg className='absolute inset-0 w-full h-full opacity-30' xmlns="http://www.w3.org/2000/svg">
          <motion.line 
            x1="15%" 
            y1="25%" 
            x2="75%" 
            y2="50%" 
            stroke="url(#line-gradient)" 
            strokeWidth="2"
            strokeDasharray="5,5"
            animate={{
              strokeDashoffset: [0, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              strokeDashoffset: { duration: 2, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 3, repeat: Infinity, repeatType: 'reverse' },
            }}
          />
          <motion.line 
            x1="75%" 
            y1="60%" 
            x2="30%" 
            y2="85%" 
            stroke="url(#line-gradient-2)" 
            strokeWidth="2"
            strokeDasharray="5,5"
            animate={{
              strokeDashoffset: [0, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              strokeDashoffset: { duration: 2.5, repeat: Infinity, ease: 'linear' },
              opacity: { duration: 4, repeat: Infinity, repeatType: 'reverse' },
            }}
          />
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B45FF" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="line-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]'>
          {/* Left Column - Text Content */}
          <motion.div 
            className='text-white space-y-8'
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div className='flex justify-start' variants={itemVariants}>
              <motion.div 
                className='bg-black/60 text-white text-sm py-3 px-6 rounded-full flex items-center border border-purple-400/50 backdrop-blur-md'
                animate={{
                  boxShadow: [
                    '0 0 0 rgba(139, 69, 255, 0)',
                    '0 0 15px rgba(139, 69, 255, 0.3)',
                    '0 0 0 rgba(139, 69, 255, 0)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <span className='mr-2 text-sm uppercase tracking-wider font-medium'>No-Code Platform</span>
                <div className='bg-gradient-to-r from-purple-500 to-blue-500 rounded-full w-6 h-6 flex items-center justify-center'>
                  <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3L5.5 8.5L3 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className='font-medium text-2xl md:text-6xl lg:text-5xl leading-[1.1] tracking-tight'
              variants={itemVariants}
            >
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200'>
                Transform Your Vision Into Digital Assets<br />
                Without Writing Code<br />

              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className='text-gray-300 text-lg leading-relaxed max-w-lg'
              variants={itemVariants}
            >
              Turn your ideas into valuable digital assets in minutes. Our intuitive platform empowers creators, entrepreneurs, and businesses to mint NFTs and launch tokens with zero technical knowledge required.
            </motion.p>

            {/* Call to action buttons */}
            <motion.div 
              className='flex flex-col sm:flex-row gap-4 pt-4'
              variants={itemVariants}
            >   
            </motion.div>

            {/* Get Started Section */}
            <motion.div 
              className='pt-8'
              variants={itemVariants}
            >
              {isConnected ? (
                <Link href='/role-selection'>
                  <motion.button
                    className='bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-base rounded-full px-10 py-4 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20'
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 30px rgba(139, 69, 255, 0.4)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started 
                  </motion.button>
                </Link>
              ) : (
                <motion.button
                  onClick={handleGetStarted}
                  className='bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-base rounded-full px-10 py-4 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20'
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 30px rgba(139, 69, 255, 0.4)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started 
                </motion.button>
              )}

              {/* <Link href='/listings'>
              <motion.button
                className='border border-white text-white font-semibold text-sm rounded-full w-full sm:w-[138px] h-[40px] px-5 transition-all duration-300 backdrop-blur-sm hover:bg-white/10 hover:border-blue-400'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                View Listings
              </motion.button>
            </Link> */}

            </motion.div>
          </motion.div>

          {/* Right Column - Visual Space for Geometric Design */}
          <div className='relative lg:block hidden'>
            {/* This space is intentionally left for the floating geometric elements */}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-60'
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollY > 50 ? 0 : 0.6 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className='w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-1'
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
            className='w-1 h-2 bg-white/60 rounded-full'
            animate={{
              y: [0, 5, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;