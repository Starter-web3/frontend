'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

type PlatformFeaturesProps = Record<string, never>;

interface FeatureData {
  title: string;
  description: string;
  icon: string;
}

const PlatformFeatures: React.FC<PlatformFeaturesProps> = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features: FeatureData[] = [
    {
      title: 'One-Click Token Deployment',
      description: 'Deploy multiple token standards (ERC-20, ERC-721, ERC-1155) with just a few clicks. No coding required.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
    {
      title: 'Campaign Management',
      description: 'Create, manage, and track airdrops and marketing campaigns with our integrated management system.',
      icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
    },
    {
      title: 'Whitelist Management',
      description: 'Easily manage token distribution with CSV uploads, manual address addition, and wallet verification systems.',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
    },
    {
      title: 'Specialized Token Templates',
      description: 'Ready-to-deploy memecoin and stablecoin contracts with advanced features like anti-whale mechanisms and collateralization.',
      icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
  };

  return (
    <section className="py-20 bg-[#1A0D23] relative overflow-hidden">
      {/* Decorative blockchain elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <svg className="absolute top-10 right-40 w-40 h-40 text-purple-500/5" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" />
        </svg>
        <svg className="absolute bottom-20 left-20 w-24 h-24 text-blue-500/5" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" />
        </svg>
        <svg className="absolute top-1/2 left-1/3 w-32 h-32 text-indigo-500/5" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 15L85 35V65L50 85L15 65V35L50 15Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-semibold mb-4"
            style={{
              background: 'linear-gradient(to right, #C44DFF, #0AACE6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Strataforge Platform Features
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Our unified platform empowers creators, businesses, and communities to deploy tokens without requiring blockchain development expertise.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`bg-gradient-to-br p-[1px] rounded-xl ${
                index % 2 === 0 
                  ? 'from-[#C44DFF]/20 to-[#0AACE6]/20' 
                  : 'from-[#0AACE6]/20 to-[#C44DFF]/20'
              } ${activeFeature === index ? 'ring-2 ring-purple-500/50' : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="bg-[#1E1425] p-6 rounded-xl h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    index % 2 === 0 ? 'bg-purple-500/10' : 'bg-blue-500/10'
                  }`}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={index % 2 === 0 ? '#C44DFF' : '#0AACE6'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather"
                    >
                      <path d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-medium ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformFeatures;