'use client';
import PropertyCard from './PropertyCard';
// import { useState } from 'react';
// Sample property data
const properties = [
  {
    id: '1',
    title: '2 Bedroom Flat - Ikeja',
    price: '0.85ETH / $2500',
    location: 'Airport Road, Ikeja',
    bedrooms: 2,
    bathrooms: 1,
    area: '1,200 sqft',
    image: '/luxury2.jpeg',
    zone: 'Ikeja Zone',
  },
  {
    id: '2',
    title: '2 Bedroom Flat - Ikeja',
    price: '0.85ETH / $2500',
    location: 'Allen Avenue, Ikeja',
    bedrooms: 2,
    bathrooms: 1,
    area: '1,350 sqft',
    image: '/luxury2.jpeg',
    zone: 'Ikeja Zone',
  },
  {
    id: '3',
    title: '2 Bedroom Flat - Ikeja',
    price: '0.95ETH / $3500',
    location: 'Adeniyi Jones, Ikeja',
    bedrooms: 2,
    bathrooms: 2,
    area: '1,500 sqft',
    image: '/luxury2.jpeg',
    zone: 'Ikeja Zone',
  },
  {
    id: '4',
    title: '2 Bedroom Flat - Ikeja',
    price: '1.85ETH / $5500',
    location: 'Alausa, Ikeja',
    bedrooms: 2,
    bathrooms: 1,
    area: '1,100 sqft',
    image: '/luxury2.jpeg',
    zone: 'Ikeja Zone',
  },
  {
    id: '5',
    title: '2 Bedroom Flat - Ikeja',
    price: '1.95ETH / $7500',
    location: 'Oregun, Ikeja',
    bedrooms: 2,
    bathrooms: 2,
    area: '1,300 sqft',
    image: '/luxury2.jpeg',
    zone: 'Ikeja Zone',
  },
  {
    id: '6',
    title: '2 Bedroom Flat - Ikeja',
    price: '3.85ETH / $15500',
    location: 'Opebi, Ikeja',
    bedrooms: 2,
    bathrooms: 2,
    area: '1,400 sqft',
    image: '/luxury2.jpeg',
    zone: 'Ikeja Zone',
  },
  {
    id: '7',
    title: '2 Bedroom Flat - Ikeja',
    price: '1.85ETH / $5500',
    location: 'Ikeja GRA, Ikeja',
    bedrooms: 2,
    bathrooms: 1,
    area: '1,250 sqft',
    image: '/luxury2.jpeg',
    zone: 'Ikeja Zone',
  },
  {
    id: '8',
    title: '2 Bedroom Flat - Ikeja',
    price: '1.85ETH / $5500',
    location: 'Maryland, Ikeja',
    bedrooms: 2,
    bathrooms: 2,
    area: '1,350 sqft',
    image: '/luxury2.jpeg',
    zone: 'Ikeja Zone',
  },
];

export default function PropertyGrid() {
  // const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  return (
    <div className='max-w-7xl mx-auto px-4 py-6'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {properties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
    </div>
  );
}
