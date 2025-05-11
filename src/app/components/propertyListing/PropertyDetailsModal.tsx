'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, X, MapPin, BedDouble, Bath, Ruler, Users } from 'lucide-react';

import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import Modal from '../../../../src/ui/modal';
interface PropertyDetailsModalProps {
  property: {
    id: string;
    title: string;
    price: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    image: string;
    zone: string;
    description?: string;
    yearBuilt?: number;
    amenities?: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyDetailsModal({ property, isOpen, onClose }: PropertyDetailsModalProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImage, setCurrentImage] = useState(property.image);

  // Sample additional images for gallery
  const propertyImages = [property.image, '/luxury2.jpeg', '/luxury3.jpeg', '/luxury4.jpeg'];

  // Sample amenities
  const amenities = ['Swimming Pool', 'Gym', 'Parking', 'Security', '24/7 Electricity', 'WiFi'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <div className='relative bg-[#201726] rounded-lg overflow-hidden'>
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors'
        >
          <X className='h-5 w-5 text-white' />
        </button>

        {/* Image gallery */}
        <div className='relative h-64 md:h-80 w-full'>
          <Image src={currentImage} alt={property.title} fill className='object-cover' />

          {/* Favorite button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className='absolute top-4 right-16 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors'
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>

          {/* Image thumbnails */}
          <div className='absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto'>
            {propertyImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(img)}
                className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                  currentImage === img ? 'border-purple-400' : 'border-transparent'
                }`}
              >
                <Image
                  src={img}
                  alt={`Property image ${index + 1}`}
                  width={64}
                  height={64}
                  className='object-cover w-full h-full'
                />
              </button>
            ))}
          </div>
        </div>

        {/* Property details */}
        <div className='p-6'>
          <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-white mb-2'>{property.title}</h2>
              <div className='flex items-center text-purple-400 font-semibold mb-2'>
                <MapPin className='h-4 w-4 mr-1' />
                <span>{property.location}</span>
              </div>
              <Badge className='bg-[#F0E2F7] text-[#511C6C]'>{property.zone}</Badge>
            </div>

            <div className='text-right'>
              <p className='text-2xl font-bold text-purple-400'>{property.price}</p>
              <Badge className='text-green-600 bg-white mt-1'>Available</Badge>
            </div>
          </div>

          {/* Property features */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-[#2A1D30] rounded-lg'>
            <div className='flex items-center gap-2'>
              <BedDouble className='h-5 w-5 text-purple-400' />
              <div>
                <p className='text-gray-400 text-sm'>Bedrooms</p>
                <p className='text-white font-medium'>{property.bedrooms}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Bath className='h-5 w-5 text-purple-400' />
              <div>
                <p className='text-gray-400 text-sm'>Bathrooms</p>
                <p className='text-white font-medium'>{property.bathrooms}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Ruler className='h-5 w-5 text-purple-400' />
              <div>
                <p className='text-gray-400 text-sm'>Area</p>
                <p className='text-white font-medium'>{property.area}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Users className='h-5 w-5 text-purple-400' />
              <div>
                <p className='text-gray-400 text-sm'>Year Built</p>
                <p className='text-white font-medium'>{property.yearBuilt || 2020}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-white mb-2'>Description</h3>
            <p className='text-gray-300'>
              {property.description ||
                'This beautiful property offers modern amenities in a prime location. The spacious rooms and contemporary design make it perfect for comfortable living. Located in a secure neighborhood with easy access to major roads and amenities.'}
            </p>
          </div>

          {/* Amenities */}
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-white mb-3'>Amenities</h3>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
              {amenities.map((amenity, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-purple-400'></div>
                  <span className='text-gray-300'>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button className='flex-1 bg-purple-600 hover:bg-purple-700 text-white'>
              Book Viewing
            </Button>
            <Button className='flex-1 bg-transparent border border-purple-400 text-purple-400 hover:bg-purple-400/10'>
              Make Offer
            </Button>
            <Button className='flex-1 bg-transparent border border-white text-white hover:bg-white/10'>
              Contact Agent
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
