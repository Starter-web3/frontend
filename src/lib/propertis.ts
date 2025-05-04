// types/property.d.ts
export interface Property {
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
    images?: string[]; // Array of additional images
  }


// // This is a mock database of properties
// // In a real application, you would fetch this data from an API or database

// export interface Property {
//     id: string
//     title: string
//     price: string
//     ethPrice?: string
//     usdPrice?: string
//     location: string
//     bedrooms: number
//     bathrooms: number
//     area: string
//     image: string
//     images: string[]
//     zone: string
//     description: string
//     features: string[]
//     owner: {
//       name: string
//       image: string
//       rating: number
//       reviewCount: number
//       since: string
//     }
//     agent: {
//       name: string
//       phone: string
//       email: string
//       image: string
//     }
//     documents: {
//       name: string
//       verified: boolean
//     }[]
//   }
  
//   const properties: Property[] = [
//     {
//       id: "prop-001",
//       title: "2 Bedroom Flat - Ikeja",
//       price: "₦500,000/year",
//       ethPrice: "0.85 ETH",
//       usdPrice: "$2,500",
//       location: "23 Eagle Avenue, Ikeja, Lagos",
//       bedrooms: 2,
//       bathrooms: 2,
//       area: "1,200 sqft",
//       image: "/images/property-1.jpg",
//       images: [
//         "/images/property-1.jpg",
//         "/images/property-1-interior-1.jpg",
//         "/images/property-1-interior-2.jpg",
//         "/images/property-1-bathroom.jpg",
//       ],
//       zone: "Ikeja Zone",
//       description:
//         "This modern 2-bedroom apartment is perfectly located in Lekki Phase 1, comes with superior, spacious parking, enviable bedrooms, modern kitchen and separate washing facilities. The modern 2-bedroom apartment is perfectly located in Lekki Phase 1, comes with free Wi-Fi, spacious parking, and enviable bedrooms. Ready to move in and registered security included.",
//       features: ["Air Conditioning", "Swimming Pool", "24/7 Security", "Parking Space", "Gym"],
//       owner: {
//         name: "Fredrick O.",
//         image: "/images/owner-1.jpg",
//         rating: 4.8,
//         reviewCount: 23,
//         since: "2018",
//       },
//       agent: {
//         name: "Kevin Smith",
//         phone: "+234 8173725865",
//         email: "kevinsmith@propty.co",
//         image: "/images/agent-1.jpg",
//       },
//       documents: [
//         { name: "Title Certificate", verified: true },
//         { name: "Survey Plan.jpg", verified: true },
//         { name: "Zoning Letter.pdf", verified: true },
//       ],
//     },
//     {
//       id: "prop-002",
//       title: "2 Bedroom Flat - Baga",
//       price: "₦450,000/year",
//       ethPrice: "0.75 ETH",
//       usdPrice: "$2,200",
//       location: "15 Marina Street, Baga, Lagos",
//       bedrooms: 2,
//       bathrooms: 1,
//       area: "1,050 sqft",
//       image: "/images/property-2.jpg",
//       images: [
//         "/images/property-2.jpg",
//         "/images/property-2-interior-1.jpg",
//         "/images/property-2-interior-2.jpg",
//         "/images/property-2-bathroom.jpg",
//       ],
//       zone: "Baga Zone",
//       description:
//         "Beautiful 2-bedroom apartment in the heart of Baga. This property features modern amenities, a spacious living area, and is close to shopping centers and restaurants. Perfect for young professionals or small families looking for comfort and convenience.",
//       features: ["Balcony", "24/7 Security", "Parking Space", "Water Heater", "CCTV"],
//       owner: {
//         name: "Sarah J.",
//         image: "/images/owner-2.jpg",
//         rating: 4.5,
//         reviewCount: 17,
//         since: "2019",
//       },
//       agent: {
//         name: "Michael Brown",
//         phone: "+234 8056781234",
//         email: "michaelbrown@propty.co",
//         image: "/images/agent-2.jpg",
//       },
//       documents: [
//         { name: "Title Certificate", verified: true },
//         { name: "Survey Plan.jpg", verified: true },
//         { name: "Building Approval.pdf", verified: false },
//       ],
//     },
//     // Add more properties as needed
//   ]
  
//   export async function getAllProperties(): Promise<Property[]> {
//     // In a real app, you would fetch from an API or database
//     return properties
//   }
  
//   export async function getPropertyById(id: string): Promise<Property | undefined> {
//     // In a real app, you would fetch from an API or database
//     return properties.find((property) => property.id === id)
//   }
  
//   export async function getRelatedProperties(currentId: string): Promise<Property[]> {
//     // In a real app, you would fetch related properties based on criteria
//     return properties.filter((property) => property.id !== currentId).slice(0, 4)
//   }
  