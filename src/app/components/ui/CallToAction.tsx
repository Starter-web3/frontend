'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Fixed empty interface issue
type CallToActionProps = Record<string, never>;

const CallToAction: React.FC<CallToActionProps> = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Particles state and config
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number, opacity: number}>>([]);
  
  // Generate particles on component mount
  useEffect(() => {
    const particlesArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.5
    }));
    setParticles(particlesArray);
  }, []);

  // Image animation variants
  const imageVariants = {
    hover: {
      scale: 1.05,
      rotate: [0, 2, 0, -2, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.5,
        }
      }
    },
    floating: {
      y: [0, -15, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }
      }
    },
    initial: {
      scale: 1,
      rotate: 0
    }
  };

  // Glow pulse animation
  const glowVariants = {
    pulse: {
      opacity: [0.4, 0.8, 0.4],
      scale: [0.95, 1.05, 0.95],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className='py-16 px-6 md:px-12 lg:px-16 bg-[#201726] relative overflow-hidden'>
      {/* Background animated particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-purple-500 rounded-full z-0 opacity-20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [particle.opacity, 0]
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 10 / particle.speed,
              ease: "linear",
              repeatType: "loop"
            },
            opacity: {
              repeat: Infinity,
              duration: 10 / particle.speed,
              ease: "easeOut",
              repeatType: "loop"
            }
          }}
        />
      ))}
      
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10'>
        {/* Left Section - Text and Buttons */}
        <div className='text-white space-y-6 lg:w-1/2'>
          <motion.h2
            className='text-[56px] font-medium leading-[1.2] md:leading-tight'
            style={{
              fontFamily: 'Poppins, sans-serif',
              letterSpacing: '-2px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ready to deploy tokens <br /> without code?
          </motion.h2>

          <motion.p
            className='text-gray-300 text-[18px] font-normal leading-[1.7]'
            style={{
              fontFamily: 'Be Vietnam, sans-serif',
              letterSpacing: '0px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join our waitlist for the Q3 2025 launch and get <br /> early access to token templates,
            campaign tools, <br /> and airdrop features.
          </motion.p>

          <motion.div 
            className='flex space-x-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              className='text-white rounded-[46px] relative overflow-hidden'
              style={{
                background: 'linear-gradient(270deg, #C44DFF 0%, #0AACE6 100%)',
                width: '157px',
                height: '50px',
                padding: '16px 20px',
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 20px rgba(196, 77, 255, 0.6)' 
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0"
                animate={{ 
                  opacity: [0, 0.5, 0],
                  x: ['-100%', '100%']
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
              <span className="relative z-10">Get Started</span>
            </motion.button>

            <motion.button 
              className='text-white border border-gray-500 rounded-[46px] px-6 py-3 hover:bg-gray-700'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Waitlist
            </motion.button>
          </motion.div>
        </div>

        {/* Right Section - Image with Web3 animations */}
        <div className='mt-8 lg:mt-0 lg:w-1/2 flex justify-center relative'>
          {/* Animated glow effect behind image */}
          <motion.div
            className="absolute rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl"
            style={{ width: '70%', height: '70%', top: '15%', left: '15%' }}
            variants={glowVariants}
            animate="pulse"
          />
          
          {/* Circular ring animations */}
          <motion.div 
            className="absolute w-full h-full border-2 border-purple-500 rounded-full opacity-30"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute w-full h-full border border-cyan-400 rounded-full opacity-20"
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [0.2, 0, 0.2]
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* The image with hover and floating animations */}
          <motion.div
            className='relative z-10'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            variants={imageVariants}
            animate={isHovering ? "hover" : "floating"}
            initial="initial"
          >
            <Image
              src='/3d-rendering-1.png' // Replace with the actual path to the image
              alt='Token Illustration'
              width={450}
              height={512}
              priority
              className="drop-shadow-2xl"
            />
            
            {/* Small animated particles around image */}
            <motion.div 
              className="absolute top-1/4 -left-4 w-3 h-3 bg-blue-400 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
            />
            
            <motion.div 
              className="absolute bottom-1/4 -right-2 w-2 h-2 bg-purple-500 rounded-full"
              animate={{
                y: [0, 10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            <motion.div 
              className="absolute top-1/2 -right-4 w-4 h-4 bg-cyan-400 rounded-full"
              animate={{
                y: [0, -15, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;