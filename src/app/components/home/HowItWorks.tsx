'use client';
import { motion } from 'framer-motion';

type HowItWorksProps = Record<string, never>;

interface Step {
  number: number;
  title: string;
  description: string;
}

const HowItWorks: React.FC<HowItWorksProps> = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Connect Wallet',
      description: 'Connect your Web3 wallet to securely access the platform with your blockchain identity.',
    },
    {
      number: 2,
      title: 'Browse Listings',
      description: 'Explore verified property listings with blockchain-backed ownership and inspection records.',
    },
    {
      number: 3,
      title: 'Secure Transaction',
      description: 'Execute smart contracts for purchase, rental, or investment with automatic escrow protection.',
    },
    {
      number: 4,
      title: 'Receive NFT Title',
      description: 'Get your property title as a secure NFT with complete ownership history and verification.',
    },
  ];

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
    <section className="py-20 bg-[#16091D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            How It Works
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-400 max-w-2xl mx-auto">
            Experience a seamless property journey powered by blockchain technology
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-[#1E1425] rounded-xl p-6 relative"
            >
              {/* Connected line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] z-0">
                  <div
                    className="h-full"
                    style={{
                      background: 'linear-gradient(to right, #C44DFF, #0AACE6)',
                      width: '100%',
                    }}
                  ></div>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 z-10"
                  style={{
                    background: 'linear-gradient(to right, #C44DFF, #0AACE6)',
                  }}
                >
                  {step.number}
                </div>
                <h3 className="text-white text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;