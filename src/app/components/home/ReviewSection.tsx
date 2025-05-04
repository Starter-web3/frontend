'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type ReviewSectionProps = Record<string, never>;

interface Review {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
  location?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  
  // Enhanced reviews data with locations
  const reviews: Review[] = [
    {
      name: 'Oluwaseun Johnson',
      role: 'Property Owner',
      content: 'ProptyChain has transformed how I manage my rental properties. The blockchain verification gives both me and my tenants complete peace of mind.',
      avatar: '/api/placeholder/48/48',
      rating: 5,
      location: 'Lagos'
    },
    {
      name: 'Adebola Williams',
      role: 'Property Seeker',
      content: 'Finally found my dream home without worrying about scams. The NFT verification system made the entire process transparent and secure.',
      avatar: '/api/placeholder/48/48',
      rating: 5,
      location: 'Abuja'
    },
    {
      name: 'Chioma Ezekwesili',
      role: 'Real Estate Agent',
      content: 'As an agent, ProptyChain has helped me build unprecedented trust with my clients. The escrow service is truly a game changer!',
      avatar: '/api/placeholder/48/48',
      rating: 4,
      location: 'Port Harcourt'
    }
  ];

  // Auto-scroll effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoScrolling) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [isAutoScrolling, reviews.length]);

  const handleManualScroll = (index: number) => {
    setCurrentIndex(index);
    setIsAutoScrolling(false);
    
    // Resume auto scrolling after 10 seconds of inactivity
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  return (
    <div className="w-full overflow-hidden">
      <motion.div 
        className="mb-4 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Updated trust badge with stats */}
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white/90 text-sm font-medium ml-1">4.9<span className="text-white/60 text-xs">/5</span></span>
            </div>
            <div className="h-4 w-px bg-white/20"></div>
            <p className="text-white/80 text-sm font-medium">Trusted by <span className="text-white font-semibold">5,000+</span> Nigerians</p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="relative w-full h-40 overflow-hidden rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Reviews slider with improved design */}
        <div className="flex h-full">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center p-6 text-center transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentIndex ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Quote icon */}
              <svg className="w-6 h-6 text-blue-400/40 absolute top-4 left-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              
              <div className="mb-2 flex items-center justify-center">
                {/* Star rating */}
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              <p className="text-white text-sm italic leading-snug">&quot;{review.content}&quot;</p>
              
              <div className="mt-3 flex items-center">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-purple-500/20">
                  {review.name.charAt(0)}
                </div>
                <div className="ml-2 text-left">
                  <p className="text-white text-xs font-medium">{review.name}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-gray-400 text-xs">{review.role}</p>
                    {review.location && (
                      <>
                        <span className="text-gray-500 text-xs">•</span>
                        <p className="text-gray-400 text-xs">{review.location}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Improved navigation dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => handleManualScroll(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-gradient-to-r from-purple-500 to-blue-500 w-6' : 'bg-gray-500/50 w-2'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewSection;