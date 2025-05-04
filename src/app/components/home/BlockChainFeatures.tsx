'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

type BlockchainFeaturesProps = Record<string, never>;

interface FeatureData {
  title: string;
  description: string;
  icon: string;
}

const BlockchainFeatures: React.FC<BlockchainFeaturesProps> = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features: FeatureData[] = [
    {
      title: 'NFT Property Titles',
      description: 'Secure, immutable property ownership records minted as NFTs on the blockchain. No more title fraud.',
      icon: 'M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3m3-4H3m4 0L3 12m4 0-4-4',
    },
    {
      title: 'Smart Contract Escrow',
      description: 'Funds are held securely in escrow smart contracts until all conditions of a sale or rental are met.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
      title: 'On-Chain Verification',
      description: 'All property documents and agent credentials are verified and recorded on the blockchain for complete transparency.',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Fractional Ownership',
      description: 'Tokenized real estate allows investors to buy and sell fractions of high-value properties, improving market liquidity.',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
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
            Blockchain-Powered Real Estate
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Our platform leverages blockchain technology to solve the most persistent problems in the Nigerian real estate market.
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

export default BlockchainFeatures;