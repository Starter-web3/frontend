// import Image from "next/image"
// import Link from "next/link"
// import { ChevronRight } from "lucide-react"

// export default function BrowseMore() {
//   const properties = [
//     {
//       id: 1,
//       title: "2 Bedroom Flat - Nejo",
//       price: "1,240.66",
//       eth: "0.85",
//       image: "/bedroom.png",
//       isHot: true,
//     },
//     {
//       id: 2,
//       title: "3 Bedroom Flat - Nejo",
//       price: "1,540.66",
//       eth: "1.05",
//       image: "/bedroom.png",
//       isHot: false,
//     },
//     {
//       id: 3,
//       title: "4 Bedroom Flat - Nejo",
//       price: "1,840.66",
//       eth: "1.25",
//       image: "/bedroom.png",
//       isHot: false,
//     },
//     {
//       id: 4,
//       title: "5 Bedroom Flat - Nejo",
//       price: "2,140.66",
//       eth: "1.45",
//       image: "/bedroom.png",
//       isHot: false,
//     },
//   ]

//   return (
//     <div className="mt-20 mb-16 bg-[#201726]">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Browse More</h2>
//         <Link href="#" className="text-sm text-gray-400 flex items-center hover:text-white transition-colors">
//           View All <ChevronRight className="w-4 h-4 ml-1" />
//         </Link>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//         {properties.map((property) => (
//           <div key={property.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden">
//             <div className="relative h-60 w-60">
//               <Image src={property.image || "/placeholder.svg"} alt={property.title} fill className="object-cover"/>
//               {property.isHot && (
//                 <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                   Hot Deal
//                 </div>
//               )}
//             </div>
//             <div className="p-3">
//               <h3 className="font-semibold text-sm">{property.title}</h3>
//               <div className="flex justify-between items-center mt-2">
//                 <div>
//                   <p className="text-xs text-gray-400">PRICE</p>
//                   <p className="text-sm font-bold text-blue-500">{property.price}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-400">ETH</p>
//                   <p className="text-sm">{property.eth}</p>
//                 </div>
//               </div>
//               <button className="mt-3 w-full bg-[#252525] hover:bg-[#303030] text-xs py-1.5 rounded transition-colors">
//                 View Details
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }



import PropertyCard from '@/src/app/components/propertyListing/PropertyCard';
// import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

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

        <div className="mt-20 mb-16 bg-[#201726]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Browse More</h2>
        <Link href="#" className="text-sm text-gray-400 flex items-center hover:text-white transition-colors">
          View All <ChevronRight className="w-4 h-4 ml-1" />
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
