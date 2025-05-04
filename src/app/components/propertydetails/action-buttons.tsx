import { MessageSquare, Phone, Share, Calendar } from "lucide-react"
export default function ActionButtons() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 p-3 z-40 md:static md:bg-transparent md:border-0 md:p-0 md:mt-8">
      <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-6xl mx-auto">
        <button className="flex flex-col items-center justify-center bg-[#252525] hover:bg-[#303030] p-2 rounded-md transition-colors">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <span className="text-xs mt-1">Message</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-[#252525] hover:bg-[#303030] p-2 rounded-md transition-colors">
          <Phone className="w-5 h-5 text-blue-500" />
          <span className="text-xs mt-1">Phone</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-[#252525] hover:bg-[#303030] p-2 rounded-md transition-colors">
          <Share className="w-5 h-5 text-blue-500" />
          <span className="text-xs mt-1">Share</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 p-2 rounded-md transition-colors">
          <Calendar className="w-5 h-5" />
          <span className="text-xs mt-1">Book</span>
        </button>
      </div>
      <div className="mt-3 text-center md:text-right">
        <p className="text-sm text-gray-400">
          <span className="font-bold text-white">+1 (234) 567-8910</span>
        </p>
      </div>
    </div>
  )
}
