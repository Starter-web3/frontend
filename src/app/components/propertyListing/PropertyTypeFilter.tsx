"use client"

import type React from "react"

import { useState } from "react"
import { Building, Home, MapPin, Warehouse, MoreHorizontal } from "lucide-react"

type PropertyType = "Residential" | "Commercial" | "Land & Plots" | "Industrial" | "Others"

export default function PropertyTypeFilter() {
  const [selectedType, setSelectedType] = useState<PropertyType>("Residential")

  const propertyTypes: { type: PropertyType; icon: React.ReactNode }[] = [
    { type: "Residential", icon: <Home className="h-5 w-5" /> },
    { type: "Commercial", icon: <Building className="h-5 w-5" /> },
    { type: "Land & Plots", icon: <MapPin className="h-5 w-5" /> },
    { type: "Industrial", icon: <Warehouse className="h-5 w-5" /> },
    { type: "Others", icon: <MoreHorizontal className="h-5 w-5" /> },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-center gap-2 md:gap-4">
        {propertyTypes.map((item) => (
          <button
            key={item.type}
            onClick={() => setSelectedType(item.type)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
              selectedType === item.type ? "bg-purple-600 text-white" : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center mb-1">{item.icon}</div>
            <span className="text-xs md:text-sm whitespace-nowrap">{item.type}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
