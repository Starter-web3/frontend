'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Fixed empty interface issue
type CallToActionProps = Record<string, never>;

const CallToAction: React.FC<CallToActionProps> = () => {
  return (
    <section className='py-16 px-6 md:px-12 lg:px-16 bg-[#201726]'>
      <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between'>
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
            Ready to see real <br /> estate on-chain?
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
            Join our waitlist for the April 30 demo and get <br /> early access to NFT listings,
            escrow deals, and <br /> PCH rewards.
          </motion.p>

          <div className='flex space-x-4'>
            <button
              className='text-white rounded-[46px]'
              style={{
                background: 'linear-gradient(270deg, #C44DFF 0%, #0AACE6 100%)',
                width: '157px',
                height: '50px',
                padding: '16px 20px',
              }}
            >
              Get Started
            </button>

            <button className='text-white border border-gray-500 rounded-[46px] px-6 py-3 hover:bg-gray-700'>
              Join Waitlist
            </button>
          </div>
        </div>

        {/* Right Section - Image */}
        <motion.div
          className='mt-8 lg:mt-0 lg:w-1/2 flex justify-center'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Image
            src='/3d-rendering.png' // Replace with the actual path to the image
            alt='Room Illustration'
            width={450}
            height={512}
            priority
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
