'use client';
import { useState } from 'react';

// Fixed empty interface issue
type SearchFormProps = Record<string, never>;

// Define possible tab values
type Tab = 'buy' | 'sell' | 'rent';

const SearchForm: React.FC<SearchFormProps> = () => {
  const [activeTab, setActiveTab] = useState<Tab>('buy');

  return (
    <div className='mt-8'>
      <div className='bg-[#CAC1C8] bg-opacity-10 backdrop-blur-sm rounded-lg p-4'>
        <div className='flex space-x-1 mb-4'>
          {(['Buy', 'Sell', 'Rent'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase() as Tab)}
              className={`px-6 py-2 rounded-full transition ${
                activeTab === tab.toLowerCase()
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
              type='button'
            >
              {tab}
            </button>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          <div className='bg-white bg-opacity-10 rounded p-2'>
            <label className='block text-xs text-gray-300 mb-1'>📍 Location</label>
            <input
              type='text'
              placeholder='1, Osode Street Ikeja'
              className='bg-transparent w-full text-white outline-none placeholder-gray-400'
            />
          </div>

          <div className='bg-white bg-opacity-10 rounded p-2'>
            <label className='block text-xs text-gray-300 mb-1'>🏠 Type</label>
            <select className='bg-transparent w-full text-white outline-none appearance-none'>
              <option className='bg-[#1E0C1C] text-white' value='Minimalist, Modern'>
                Minimalist, Modern
              </option>
              <option className='bg-[#1E0C1C] text-white' value='Traditional'>
                Traditional
              </option>
              <option className='bg-[#1E0C1C] text-white' value='Luxury'>
                Luxury
              </option>
            </select>
          </div>

          <button
            className='bg-[#682617] hover:bg-[#1F0904] text-white py-3 px-4 rounded-md transition duration-300 flex justify-center items-center'
            type='button'
          >
            Join now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
