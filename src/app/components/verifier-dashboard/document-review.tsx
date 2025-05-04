import type React from "react"
import { FileText } from "lucide-react"

// Types
export interface Document {
  id: number
  title: string
}

interface DocumentsToReviewProps {
  documents: Document[]
}

const DocumentsToReview: React.FC<DocumentsToReviewProps> = ({ documents }) => {
  return (
    <div className="mb-10">
      <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">Documents to Review</h2>
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-lg bg-[hsl(var(--foreground)/0.05)] border border-[hsl(var(--border))]"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-[hsl(var(--primary-from))]" />
                <span className="text-sm">{doc.title}</span>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs rounded-md bg-[hsl(var(--foreground)/0.1)] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.15)] transition">
                  Approve
                </button>
                <button className="px-3 py-1 text-xs rounded-md bg-[hsl(var(--foreground)/0.1)] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--foreground)/0.15)] transition">
                  Reject Document
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DocumentsToReview
