import type React from "react"
// import { Flag, AlertTriangle, Info } from "lucide-react"

// Types
export interface Alert {
  id: number
  type: "danger" | "warning" | "info"
  message: string
}

interface AlertsProps {
  alerts: Alert[]
}

const Alerts: React.FC<AlertsProps> = ({ alerts }) => {
  return (
    <div className="mb-10">
      <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">Alerts & Flags</h2>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-[hsl(var(--foreground)/0.1)] p-4 rounded-lg border border-[hsl(var(--border))] flex justify-between items-center hover:bg-[hsl(var(--foreground)/0.2)] transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="font-inter text-sm">{alert.message}</p>
            </div>
            <button className="text-xs text-[hsl(var(--foreground)/0.5)] hover:text-[hsl(var(--foreground))] transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Alerts
