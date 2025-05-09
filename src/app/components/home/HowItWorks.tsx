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
      title: 'Configure Token',
      description: 'Set up your token parameters with our intuitive interface - no coding required.',
    },
    {
      number: 3,
      title: 'One-Click Deploy',
      description: 'Deploy your token to the blockchain with a single click and automatic verification.',
    },
    {
      number: 4,
      title: 'Manage Campaigns',
      description: 'Run airdrops, marketing campaigns, and track analytics from your dashboard.',
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
            Experience a seamless token deployment journey powered by StrataForge
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