import { Check, X } from "lucide-react"

export default function OwnershipDetails() {
  const ownershipItems = [
    { label: "KYC Verified", verified: true },
    { label: "Active Portfolio", verified: true },
    { label: "Listing Verified", verified: false },
  ]

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-3">Ownership</h2>
      <div className="bg-[#1a1a1a] p-4 rounded-lg">
        <div className="space-y-4">
          {ownershipItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-[#252525] p-2 rounded-md mr-3">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm">{item.label}</span>
              </div>
              <div
                className={`px-2 py-0.5 rounded-full text-xs flex items-center ${
                  item.verified ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                }`}
              >
                {item.verified ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </>
                ) : (
                  <>
                    <X className="w-3 h-3 mr-1" />
                    Not Verified
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
