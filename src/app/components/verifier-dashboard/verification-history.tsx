import type React from "react"
import { CheckCircle, Flag, AlertTriangle } from "lucide-react"

// Types
export interface VerificationHistoryItem {
  id: number
  property: string
  location: string
  status: "verified" | "flagged" | "returned"
  date: string
  note?: string
}

interface VerificationHistoryProps {
  history: VerificationHistoryItem[]
}

const VerificationHistory: React.FC<VerificationHistoryProps> = ({ history }) => {
  return (
    <div className="mb-10">
      <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">Verification History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-[hsl(var(--foreground)/0.05)] rounded-lg border border-[hsl(var(--border))]">
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground)/0.02)]">
                <td className="px-4 py-3 whitespace-nowrap text-sm">{item.property}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{item.location}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {item.status === "verified" && (
                    <span className="flex items-center text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" /> Verified
                    </span>
                  )}
                  {item.status === "flagged" && (
                    <span className="flex items-center text-red-500">
                      <Flag className="h-4 w-4 mr-1" /> Flagged
                    </span>
                  )}
                  {item.status === "returned" && (
                    <span className="flex items-center text-amber-500">
                      <AlertTriangle className="h-4 w-4 mr-1" /> {item.note || "Returned for Edits"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VerificationHistory
