'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { PropertyDetailsModal } from './PropertyDetailsModal';

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  zone: string;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  image,
  zone,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const property = {
    id,
    title,
    price,
    location,
    bedrooms,
    bathrooms,
    area,
    image,
    zone,
    description:
      'This beautiful property offers modern amenities in a prime location. The spacious rooms and contemporary design make it perfect for comfortable living.',
    yearBuilt: 2020,
    amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security', '24/7 Electricity', 'WiFi'],
  };

  return (
    <>
      <div className='bg-[#201726] rounded-xl overflow-hidden' data-property-id={id}>
        <div className='relative'>
          <Image
            src={image || '/placeholder.svg'}
            alt={title}
            width={400}
            height={250}
            className='w-full h-48 object-cover'
          />
          <Badge className='absolute top-3 left-3 bg-[#F0E2F7] text-[#511C6C] text-xs'>
            {zone}
          </Badge>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className='absolute top-3 right-3 w-8 h-8 rounded-full bg-[#F0E2F7] flex items-center justify-center'
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#000000]'}`}
            />
          </button>
        </div>

        <div className='p-4'>
          <h3 className='font-semibold text-white mb-1'>{title}</h3>
          <p className='text-purple-400 font-bold mb-2'>{price}</p>
          <p className='text-gray-400 text-sm mb-3'>{location}</p>

          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1'>
                <span className='text-gray-400 text-xs'>🛏️</span>
                <span className='text-white text-xs'>{bedrooms}</span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-gray-400 text-xs'>🚿</span>
                <span className='text-white text-xs'>{bathrooms}</span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-gray-400 text-xs'>📏</span>
                <span className='text-white text-xs'>{area}</span>
                <Badge className='text-green-600 bg-white text-xs'>Available</Badge>
              </div>
            </div>
          </div>

          <div className='flex justify-between items-center'>
            <Button
              onClick={() => setIsModalOpen(true)}
              className='text-white text-xs h-[31px] w-[270px] hover:text-purple-400'
            >
              View Details
            </Button>
          </div>
        </div>
      </div>

      <PropertyDetailsModal
        property={property}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
