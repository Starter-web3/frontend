import { FileText } from "lucide-react"

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Listings Card */}
      <div className="border border-[hsl(var(--border))] p-5 flex-col shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[hsl(var(--foreground)/0.1)] rounded-lg flex justify-between items-center hover:bg-[hsl(var(--foreground)/0.2)] transition-all duration-300">
        <div className="w-full flex justify-start mb-3 relative z-10">
          <div className="bg-[hsl(var(--foreground)/0.1)] p-2 rounded-md shadow-md">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <h3 className="text-gray-300 font-medium text-center mb-1 relative z-10">Listings</h3>
        <p className="text-4xl font-bold text-[#00B5F5] mb-3 relative z-10">4</p>
        <button className="bg-[#F0E2F70D] text-gray-300 border border-[#F8F8F840] text-xs py-1.5 px-4 rounded-md  w-full shadow-md relative z-10">
          View All
        </button>
      </div>

      {/* Client Jobs Card */}
      <div className="border border-[hsl(var(--border))] p-5 flex-col shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[hsl(var(--foreground)/0.1)] rounded-lg flex justify-between items-center hover:bg-[hsl(var(--foreground)/0.2)] transition-all duration-300">
        <div className="w-full flex justify-start mb-3 relative z-10">
          <div className="bg-[hsl(var(--foreground)/0.1)] p-2 rounded-md shadow-md">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <h3 className="text-gray-300 font-medium text-center mb-1 relative z-10">Client Jobs</h3>
        <p className="text-4xl font-bold text-[#00B5F5] mb-3 relative z-10">4</p>
        <button className="bg-[#F0E2F70D] text-gray-300 border border-[#F8F8F840] text-xs py-1.5 px-4 rounded-md  w-full shadow-md relative z-10">
          View Jobs
        </button>
      </div>

      {/* Secure Deals Card */}
      <div className="border border-[hsl(var(--border))] p-5 flex-col shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[hsl(var(--foreground)/0.1)] rounded-lg flex justify-between items-center hover:bg-[hsl(var(--foreground)/0.2)] transition-all duration-300">
        <div className="w-full flex justify-start mb-3 relative z-10">
          <div className="bg-[hsl(var(--foreground)/0.1)] p-2 rounded-md shadow-md">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <h3 className="text-gray-300 font-medium text-center mb-1 relative z-10">Secure Deals</h3>
        <p className="text-4xl font-bold text-[#00B5F5] mb-3 relative z-10">4</p>
        <button className="bg-[#F0E2F70D] text-gray-300 border border-[#F8F8F840] text-xs py-1.5 px-4 rounded-md  w-full shadow-md relative z-10">
          View All
        </button>
      </div>


      {/* Secure Escrow Deals Card */}
      <div className="border border-[hsl(var(--border))] p-5 flex-col shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] relative overflow-hidden bg-[hsl(var(--foreground)/0.1)] rounded-lg flex justify-between items-center hover:bg-[hsl(var(--foreground)/0.2)] transition-all duration-300">
        <h3 className="text-gray-300 font-medium mb-3 relative z-10">Secure Escrow Deals</h3>
        <ul className="space-y-2 w-full relative z-10">
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-green-500">Completed</span>
          </li>
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
            <span className="text-orange-500">In Escrow</span>
          </li>
          <li className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
            <span className="text-red-500">Pending</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
