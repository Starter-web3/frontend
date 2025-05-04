import type React from "react"

// Types
export interface Metrics {
  propertiesVerified: number
  propertiesFlagged: number
  avgVerificationTime: string
  trustScore: string
}

interface PerformanceMetricsProps {
  metrics: Metrics
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  return (
    <div className="mb-10">
      <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6 flex items-center">
        Your Performance <span className="ml-2">📊</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[hsl(var(--foreground)/0.05)] border border-[hsl(var(--border))] text-center">
          <div className="text-3xl font-bold mb-1">{metrics.propertiesVerified}</div>
          <div className="text-sm text-[hsl(var(--foreground)/0.7)]">Properties Verified</div>
        </div>
        <div className="p-4 rounded-lg bg-[hsl(var(--foreground)/0.05)] border border-[hsl(var(--border))] text-center">
          <div className="text-3xl font-bold mb-1">{metrics.propertiesFlagged}</div>
          <div className="text-sm text-[hsl(var(--foreground)/0.7)]">Properties Flagged</div>
        </div>
        <div className="p-4 rounded-lg bg-[hsl(var(--foreground)/0.05)] border border-[hsl(var(--border))] text-center">
          <div className="text-3xl font-bold mb-1">{metrics.avgVerificationTime}</div>
          <div className="text-sm text-[hsl(var(--foreground)/0.7)]">Avg Verification Time</div>
        </div>
        <div className="p-4 rounded-lg bg-[hsl(var(--foreground)/0.05)] border border-[hsl(var(--border))] text-center">
          <div className="text-3xl font-bold mb-1">{metrics.trustScore}</div>
          <div className="text-sm text-[hsl(var(--foreground)/0.7)]">Trust Score</div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMetrics
