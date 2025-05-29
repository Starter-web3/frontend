'use client';
import React from 'react';

const Pricing = () => {
  // Static plan data for landing page
  const plans = [
    {
      name: 'Free',
      usdFee: 0,
      ethFee: '~0.000000',
      tokenLimit: 2,
      features: [
        'Create up to 2 tokens per month',
        'ERC-20 and ERC-721 token support',
        'Basic token creation tools',
      ],
      limitations: [
        'No ERC-1155 token support',
        'No Memecoin or Stablecoin support',
        'No airdrop functionality',
      ],
      icon: (
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
        </svg>
      ),
      isPopular: false,
    },
    {
      name: 'Classic',
      usdFee: 10, // You can update these with actual values
      ethFee: '~0.003669',
      tokenLimit: 5,
      features: [
        'Create up to 5 tokens per month',
        'ERC-20 and ERC-721 token support',
        'Basic token creation tools',
      ],
      limitations: [
        'No ERC-1155 token support',
        'No Memecoin or Stablecoin support',
        'No airdrop functionality',
      ],
      icon: (
        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            strokeWidth="2"
          />
        </svg>
      ),
      isPopular: false,
    },
    {
      name: 'Pro',
      usdFee: 49,
      ethFee: '~0.017978',
      tokenLimit: 10,
      features: [
        'Create up to 10 tokens per month',
        'ERC-20, ERC-721, and ERC-1155 token support',
        'Advanced token creation tools',
      ],
      limitations: [
        'No Memecoin or Stablecoin support',
        'No airdrop functionality',
      ],
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 12l8-8 8 8-8 8-8-8z" strokeWidth="2" />
        </svg>
      ),
      isPopular: true,
    },
    {
      name: 'Premium',
      usdFee: 99,
      ethFee: '~0.036323',
      tokenLimit: Infinity,
      features: [
        'Unlimited token creation',
        'ERC-20, ERC-721, ERC-1155, Memecoin, and Stablecoin support',
        'Full access to all token creation tools',
        'Full airdrop and distribution functionality',
      ],
      limitations: [],
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 4c-4.42 0-8 1.79-8 4s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zm-8 8v4h4v-4H4zm8 0v4h4v-4h-4zm8 0v4h4v-4h-4z"
            strokeWidth="2"
          />
        </svg>
      ),
      isPopular: false,
    },
  ];

  // Background Shapes Component
  const BackgroundShapes = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-32 h-32 border border-purple-500/10 rounded-full"></div>
      <div className="absolute top-40 right-20 w-24 h-24 border border-blue-500/10 rotate-45"></div>
      <div className="absolute bottom-32 left-20 w-40 h-40 border border-purple-400/8 rounded-2xl rotate-12"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-16 border border-cyan-500/10 rotate-45"></div>
      <div className="absolute bottom-1/4 right-1/3 w-28 h-28 border border-purple-300/8 rounded-full"></div>
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-500/3 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-500/3 to-transparent rounded-full blur-3xl"></div>
    </div>
  );

  const handleSelectPlan = (planName: string) => {
    // Redirect to subscription management page or handle plan selection
    console.log(`Selected plan: ${planName}`);
    // You can add navigation logic here
    // router.push('/dashboard/subscription');
  };

  return (
    <section className="min-h-screen bg-[#1A0D23] py-16 px-4 md:px-8 relative">
      <BackgroundShapes />
      
      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="font-poppins font-semibold text-3xl md:text-4xl text-white mb-4">
          Subscription Plans <span className="text-purple-400">💎</span>
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Choose the perfect plan to unlock token creation and airdrop features for your project.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-[#1E1425]/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 ${
                plan.isPopular 
                  ? 'border-purple-500/50 ring-2 ring-purple-500/20' 
                  : 'border-purple-500/10'
              }`}
            >
              {/* Plan Header */}
              <div className="flex items-center space-x-3 mb-6">
                {plan.icon}
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-white">
                    ${plan.usdFee.toFixed(2)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({plan.ethFee} ETH)
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">30-day subscription</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <p className="text-white font-medium mb-3">Features:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Limitations */}
              {plan.limitations.length > 0 && (
                <div className="mb-6">
                  <p className="text-white font-medium mb-3">Limitations:</p>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-400 text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              {/* <button
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600'
                    : plan.name === 'Free'
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700'
                    : 'bg-gradient-to-r from-purple-500/80 to-blue-600/80'
                }`}
              >
                {plan.name === 'Free' ? 'Get Started' : 'Select Plan'}
              </button> */}
            </div>
          ))}
        </div>
      </div>

      
    </section>
  );
};

export default Pricing;