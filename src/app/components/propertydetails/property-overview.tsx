import { Bed, Bath, Maximize, Home, Calendar, Wifi, Tv, Utensils, Wind, Car } from "lucide-react"

export default function PropertyOverview() {
  const features = [
    { icon: <Bed className="w-4 h-4" />, label: "2 Bedroom Apartment" },
    { icon: <Bath className="w-4 h-4" />, label: "1 Bath" },
    { icon: <Maximize className="w-4 h-4" />, label: "1,200 sqft" },
    { icon: <Home className="w-4 h-4" />, label: "Fully Furnished" },
    { icon: <Calendar className="w-4 h-4" />, label: "Built in 2020" },
    { icon: <Wifi className="w-4 h-4" />, label: "Free Internet" },
    { icon: <Tv className="w-4 h-4" />, label: "Cable TV/Netflix" },
    { icon: <Utensils className="w-4 h-4" />, label: "Kitchen" },
    { icon: <Wind className="w-4 h-4" />, label: "AC/Heat" },
    { icon: <Car className="w-4 h-4" />, label: "Parking" },
  ]

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-3">Overview</h2>
      <div className="bg-[#201726] p-4 rounded-lg border border-white-300">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm text-gray-400">Type</p>
            <p className="text-sm font-semibold">Apartment/Condo</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm text-gray-400">Status</p>
            <p className="text-sm font-semibold">For Rent</p>
          </div>
          <div className="col-span-2 md:col-span-3">
            <p className="text-sm text-gray-400">Value</p>
            <div className="flex items-center">
              <div className="h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full flex-grow mr-2"></div>
              <div className="bg-green-500 text-xs text-white px-2 py-0.5 rounded-full">Verified</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="bg-[#252525] p-2 rounded-md">{feature.icon}</div>
              <span className="text-sm">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
