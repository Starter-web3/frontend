"use client"

import { AlertTriangle } from "lucide-react"
// import { useRouter } from "next/navigation"

export default function ProptyChainAccessDenied() {
//   const router = useRouter()

  const handleGoToDashboard = () => {
    // Navigate to the dashboard
    // This would typically go to the user's appropriate dashboard based on their role
    console.log("Navigating to dashboard")
    // router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a0e2e] bg-gradient-to-br from-[#1a0e2e] to-[#2a1a3e] p-4">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-white">Access Denied!</h1>
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        </div>

        <p className="text-gray-300 mb-8">You are logged in as an Agent. Please switch to the correct dashboard.</p>

        <button
          onClick={handleGoToDashboard}
          className="w-full py-2.5 text-white font-medium bg-[#1f1429] border border-[#ffffff20] rounded-md hover:bg-[#2a1a3e] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1a0e2e] transition-all"
        >
          Go to My Dashboard
        </button>
      </div>
    </div>
  )
}
