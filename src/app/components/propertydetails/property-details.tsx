// import { MapPin } from "lucide-react"

// export default function PropertyDetails() {
//   return (
//     <div className="bg-[#1a1a1a] p-4 rounded-lg">
//       <div className="flex items-center text-gray-400 mb-4">
//         <MapPin className="w-4 h-4 mr-1" />
//         <span className="text-sm">123 Main Street, Ikeja, Blockchain City</span>
//       </div>
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-400">PRICE</p>
//           <p className="text-xl font-bold text-blue-500">1,240.66 + 521</p>
//         </div>
//         <div className="text-right">
//           <p className="text-sm text-gray-400">PROPERTY WORTH</p>
//           <p className="text-lg font-semibold">0.85 ETH / $2,500</p>
//         </div>
//       </div>
//       <div className="mt-3">
//         <p className="text-sm text-gray-400">ADDRESS</p>
//         <p className="text-sm font-mono truncate">0x7a69...420a</p>
//       </div>
//       <div className="mt-3">
//         <p className="text-sm text-gray-400">COORDINATES</p>
//         <p className="text-sm">41.40338, 2.17403</p>
//       </div>
//     </div>
//   )
// }


interface PropertyDetailsProps {
  price: string
  ethPrice?: string
  usdPrice?: string
  location: string
  bedrooms: number
  bathrooms: number
  area: string
  zone: string
}

export default function PropertyDetails({
  // price,
  ethPrice,
  usdPrice,
  location,
  bedrooms,
  bathrooms,
  area,
  zone,
}: PropertyDetailsProps) {
  return (
    <div className="bg-[#2a1a3e] rounded-lg p-4 text-white">
      <h2 className="text-xl font-semibold mb-4">Property Details</h2>

      {ethPrice && usdPrice && (
        <div className="mb-4">
          <p className="text-gray-300 mb-1">PRICE</p>
          <p className="text-xl font-bold text-blue-400">
            {ethPrice} / {usdPrice}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full">🏠</span>
          <span>2 Bedroom Apartment</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full">📍</span>
          <span>Apartment</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full">🛏️</span>
          <span>{bedrooms}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full">🚿</span>
          <span>{bathrooms}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full">📏</span>
          <span>{area}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full">🏙️</span>
          <span>{zone}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-6 h-6 flex items-center justify-center bg-[#3a2a4e] rounded-full">📍</span>
          <span>{location}</span>
        </div>
      </div>
    </div>
  )
}
