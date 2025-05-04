import type React from "react"

// Types
export interface Announcement {
  id: number
  icon: "new" | "policy" | "trophy"
  title: string
  message: string
}

interface AnnouncementsProps {
  announcements: Announcement[]
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  return (
    <div className="mb-10">
      <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">Platform Announcements</h2>
      <div className="space-y-3">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="p-4 rounded-lg bg-[hsl(var(--foreground)/0.05)] border border-[hsl(var(--border))]"
          >
            <div className="flex items-start">
              {announcement.icon === "new" && (
                <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mr-3 mt-0.5">NEW</span>
              )}
              {announcement.icon === "policy" && (
                <span className="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded mr-3 mt-0.5">📋</span>
              )}
              {announcement.icon === "trophy" && (
                <span className="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded mr-3 mt-0.5">🏆</span>
              )}
              <div>
                <h3 className="font-medium text-sm mb-1">{announcement.title}</h3>
                <p className="text-xs text-[hsl(var(--foreground)/0.7)]">{announcement.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Announcements
