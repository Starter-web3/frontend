import PropertyCard from '../propertyListing/PropertyCard';
// import Image from "next/image"
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
  // {
  //   id: '5',
  //   title: '2 Bedroom Flat - Ikeja',
  //   price: '₦ 42,000 / YEAR',
  //   location: 'Oregun, Ikeja',
  //   bedrooms: 2,
  //   bathrooms: 2,
  //   area: '1,300 sqft',
  //   image: '/luxury2.jpeg',
  //   zone: 'Ikeja Zone',
  // },
  // {
  //   id: '6',
  //   title: '2 Bedroom Flat - Ikeja',
  //   price: '₦ 50,000 / YEAR',
  //   location: 'Opebi, Ikeja',
  //   bedrooms: 2,
  //   bathrooms: 2,
  //   area: '1,400 sqft',
  //   image: '/luxury2.jpeg',
  //   zone: 'Ikeja Zone',
  // },
  // {
  //   id: '7',
  //   title: '2 Bedroom Flat - Ikeja',
  //   price: '₦ 38,000 / YEAR',
  //   location: 'Ikeja GRA, Ikeja',
  //   bedrooms: 2,
  //   bathrooms: 1,
  //   area: '1,250 sqft',
  //   image: '/luxury2.jpeg',
  //   zone: 'Ikeja Zone',
  // },
  // {
  //   id: '8',
  //   title: '2 Bedroom Flat - Ikeja',
  //   price: '₦ 48,000 / YEAR',
  //   location: 'Maryland, Ikeja',
  //   bedrooms: 2,
  //   bathrooms: 2,
  //   area: '1,350 sqft',
  //   image: '/luxury2.jpeg',
  //   zone: 'Ikeja Zone',
  // },
];

export default function BrowseMore() {
  return (
    <div className='mt-20 mb-16 bg-[#201726]'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Browse More</h2>
        <Link
          href='#'
          className='text-sm text-gray-400 flex items-center hover:text-white transition-colors'
        >
          View All <ChevronRight className='w-4 h-4 ml-1' />
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </div>
  );
}
