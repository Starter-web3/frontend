'use client';

import { useState } from 'react';
import { Search, Home, Building, MapPin, Warehouse, MoreHorizontal } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [area, setArea] = useState('All Zone');
  const [listingType, setListingType] = useState('Listing Type');

  const propertyTypes = [
    { type: 'Residential', icon: <Home className='h-5 w-5' />, count: 50 },
    { type: 'Commercial', icon: <Building className='h-5 w-5' />, count: 67 },
    { type: 'Land & Plots', icon: <MapPin className='h-5 w-5' />, count: 76 },
    { type: 'Industrial', icon: <Warehouse className='h-5 w-5' />, count: 76 },
    { type: 'Others', icon: <MoreHorizontal className='h-5 w-5' />, count: 78 },
  ];

  return (
    <section
      className='mt-15 py-20 px-6 md:px-12 lg:px-16 relative overflow-hidden bg-cover bg-center text-white'
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(0, 90, 150, 0.7), rgba(60, 10, 90, 0.7)), url("/listing-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className='max-w-7xl mx-auto'>
        <p className='text-center text-sm mb-2'>
          Search verified listings on-chain. Rent or own with trust.
        </p>

        <h1 className='text-4xl md:text-5xl font-bold text-center mb-8'>
          Let&apos;s Discover <span className='text-purple-500'>Lagos</span>{' '}
          <span className='text-blue-400'>City</span>
        </h1>

        <div className='flex flex-col md:flex-row items-stretch bg-white rounded-full p-1.5 max-w-4xl mx-auto'>
          {/* <div className='flex items-center flex-1 px-3 py-1.5 border-r border-gray-200'>
            <Input
              type='text'
              placeholder='Search: 2 bed flats'
              className='border-0 focus-visible:ring-0 text-black placeholder:text-gray-400 flex-1 pl-4 '
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}

          <div className='flex items-center flex-1 px-2 sm:px-3 py-1 sm:py-1.5 border-r border-gray-200'>
            <Input
              type='text'
              placeholder='Search: 2 bed flats'
              className='border-0 focus-visible:ring-0 text-black placeholder:text-gray-400 flex-1 pl-2 sm:pl-4 text-sm sm:text-base'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className='border-r border-gray-200 px-2'>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger className='border-0 focus:ring-0 bg-transparent text-black min-w-[120px] h-full flex items-center'>
                <div className='flex items-center'>
                  <MapPin className='h-4 w-4 text-gray-400 mr-2' />
                  <SelectValue placeholder='All Zone' />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All Zone'>All Zone</SelectItem>
                <SelectItem value='Ikeja'>Ikeja</SelectItem>
                <SelectItem value='Lagos Island'>Lagos Island</SelectItem>
                <SelectItem value='Lekki'>Lekki</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='border-r border-gray-200 px-2'>
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger className='border-0 focus:ring-0 bg-transparent text-black min-w-[120px] h-full flex items-center'>
                <SelectValue placeholder='Listing Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Listing Type'>Listing Type</SelectItem>
                <SelectItem value='For Sale'>For Sale</SelectItem>
                <SelectItem value='For Rent'>For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className='flex items-center justify-center text-white px-4 py-2 rounded-full'
            style={{
              background: 'linear-gradient(90deg, #0AA5E6 0%, #9B4FE9 100%)',
              boxShadow: '0 2px 8px rgba(10, 165, 230, 0.3)',
              minWidth: '160px',
              height: '45px',
              border: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <span className='mr-2 font-medium'>Search Properties</span>
            <div className='bg-white/20 rounded-full p-1 flex items-center justify-center'>
              <Search className='h-4 w-4' />
            </div>
          </Button>
        </div>

        {/* Property type categories */}
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mt-12'>
          {propertyTypes.map((property, index) => (
            <div key={index} className='bg-black/20 backdrop-blur-sm p-6 rounded-lg text-center'>
              <div className='bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2'>
                <span className='text-purple-600'>{property.icon}</span>
              </div>
              <h3 className='text-white'>{property.type}</h3>
              <p className='text-xs text-gray-200'>({property.count})</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
