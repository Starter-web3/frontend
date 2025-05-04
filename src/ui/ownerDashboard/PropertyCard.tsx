import Image from "next/image"
import { Button } from "../button"
import { MapPin, Bed, Bath, Square } from "lucide-react"

interface PropertyCardProps {
  title: string
  price: string
  location: string
  beds: number
  baths: number
  area: string
  image: string
  status?: "verified" | "pending" 
  tags?: string[] 
}

export default function PropertyCard({ 
  title, 
  price, 
  location, 
  beds, 
  baths, 
  area, 
  image, 
  status = "pending", 
  tags = ["FloodFree", "NearLekki"]  
}: PropertyCardProps) {
  return (
    <div className="bg-[#201726] rounded-2xl overflow-hidden border border-[hsl(var(--border))] transition-transform hover:scale-[1.02] duration-300 property-card h-full flex flex-col shadow-[inset_0px_0px_10px_0px_rgba(255,255,255,0.1)] relative">
      <div className="relative h-48">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="flex items-center mt-1 text-purple-500">
          <span className="font-bold">{price}</span>
          <span className="text-xs ml-1 text-gray-400">ETH</span>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-400">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{location}</span>
        </div>

        <div className="flex justify-between mt-3">
          <div className="flex items-center text-xs text-gray-400">
            <Bed className="h-3 w-3 mr-1" />
            <span>{beds} Beds</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Bath className="h-3 w-3 mr-1" />
            <span>{baths} Baths</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Square className="h-3 w-3 mr-1" />
            <span>{area}</span>
          </div>
        </div>

        {/* Tags row - displaying status and additional tags */}
        <div className="flex flex-wrap gap-2 mt-4 mb-3">
          {/* Status tag */}
          {status === "verified" ? (
            <div className="bg-green-500 text-xs px-2 py-1 rounded-md text-white font-medium">Verified</div>
          ) : (
            <div className="bg-yellow-500 text-xs px-2 py-1 rounded-md text-white font-medium">Pending</div>
          )}
          
          {/* Additional tags */}
          {tags && tags.map((tag, index) => (
            <div 
              key={index} 
              className={`text-xs px-2 py-1 rounded-md text-black font-medium ${
                tag.toLowerCase().includes('flood') ? 'bg-green-200' : 'bg-blue-200'
              }`}
            >
              #{tag}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 text-white h-8 text-xs">Delete</Button>
          <Button className="flex-1 bg-gradient-to-r from-[hsl(var(--primary-from))] to-[hsl(var(--primary-to))] text-[hsl(var(--foreground))] h-8 text-xs">Edit</Button> 
        </div>
      </div>
    </div>
  )
}