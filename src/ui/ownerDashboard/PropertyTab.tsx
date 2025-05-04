"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import PropertyCard from "./PropertyCard"

export default function ActiveListings() {
  const [activeTab, setActiveTab] = useState("My Listings")
  
  const properties = [
    {
      id: 1,
      title: "2-Bed Flat - Lake Phase 1",
      price: "0.75",
      location: "Lagos, Nigeria",
      beds: 2,
      baths: 2,
      area: "1200 sqft",
      image: "/luxury2.jpeg",
    },
    {
      id: 2,
      title: "2-Bed Flat - Lake Phase 1",
      price: "0.82",
      location: "Lagos, Nigeria",
      beds: 2,
      baths: 2,
      area: "1200 sqft",
      image: "/luxury2.jpeg",
    },
    {
      id: 3,
      title: "2-Bed Flat - Lake Phase 1",
      price: "0.68",
      location: "Lagos, Nigeria",
      beds: 2,
      baths: 2,
      area: "1200 sqft",
      image: "/luxury2.jpeg",
    },
    {
      id: 4,
      title: "2-Bed Flat - Lake Phase 1",
      price: "0.71",
      location: "Lagos, Nigeria", 
      beds: 2,
      baths: 2,
      area: "1200 sqft",
      image: "/luxury2.jpeg",
    },
  ]
  
  const clientRequests = [
    {
      id: 1,
      title: "Rent: 3BR Apartment - Lekki",
      price: "0.85 ETH / year",
      details: "| Immediate",
      action: "Apply",
    },
    {
      id: 2,
      title: "Office Space - Ikeja",
      price: "1.05 ETH / year",
      details: "| Verified Client",
      action: "Apply",
    },
    {
      id: 3,
      title: "Rent: 4BR Apartment - Lekki",
      price: "1.20 ETH / year",
      details: "| Immediate",
      action: "Apply",
    },
  ]
  
  return (
    <div className="mx-auto mb-10">
      <div className="flex justify-between items-center mb-10 border-b border-[#2A2A2A]">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab("My Listings")}
            className={`text-sm font-medium pb-2 px-1 ${
              activeTab === "My Listings"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            My Listings
          </button>
          <button
            onClick={() => setActiveTab("Active Client Request")}
            className={`text-sm font-medium pb-2 px-1 ${
              activeTab === "Active Client Request"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active Client Request
          </button>
        </div>
        <button className="text-xs text-purple-500 flex items-center">
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      {activeTab === "My Listings" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              title={property.title}
              price={property.price}
              location={property.location}
              beds={property.beds}
              baths={property.baths}
              area={property.area}
              image={property.image}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3 ">
          {clientRequests.map((request) => (
            <div key={request.id} className="bg-[hsl(var(--foreground)/0.1)] p-4 rounded-lg flex justify-between items-center hover:bg-[hsl(var(--foreground)/0.2)] transition-all duration-300">
              <div>
                <h3 className="font-medium text-white">{request.title}</h3>
              </div>
              <div className="flex space-x-4 mt-1 items-center">
                  <p className="text-sm text-gray-300">{request.price}</p>
                  <p className="text-sm text-gray-300">{request.details}</p>
                </div>
              <button className="mt-4 px-6 py-2 bg-gradient-to-r from-[hsl(var(--primary-from))] to-[hsl(var(--primary-to))] text-[hsl(var(--foreground))] rounded-3xl hover:opacity-90 transition text-sm font-medium">
                {request.action}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}