import type React from "react"

// Types
export interface PendingVerification {
  id: number
  property: string
  submitted: string
  ownerWalletShort: string
  ownerWalletFull: string
}

interface PendingVerificationsProps {
  verifications: PendingVerification[]
}

const PendingVerifications: React.FC<PendingVerificationsProps> = ({ verifications }) => {
  return (
    <div className="mb-10">
      <h2 className="font-poppins font-semibold text-xl md:text-2xl mb-6">Pending Verifications</h2>
      <div className="bg-[hsl(var(--foreground)/0.05)] rounded-lg overflow-hidden border border-[hsl(var(--border))]">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[hsl(var(--transaction-table-header-background)/1)] border-b border-[hsl(var(--border))]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider">
                  Property
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider">
                  Owner Wallet
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider">
                  Owner Wallet
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--foreground)/0.7)] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground)/0.02)]"
                >
                  <td className="px-8 py-3 whitespace-nowrap text-sm">{item.property}</td>
                  <td className="px-8 py-3 whitespace-nowrap text-sm">{item.submitted}</td>
                  <td className="px-8 py-3 whitespace-nowrap text-sm">{item.ownerWalletShort}</td>
                  <td className="px-8 py-3 whitespace-nowrap text-sm">{item.ownerWalletFull}</td>
                  <td className="px-8 py-3 whitespace-nowrap text-sm">
                    <button className="px-3 py-1 text-xs rounded-md bg-gradient-to-r from-[hsl(var(--primary-from))] to-[hsl(var(--primary-to))] text-[hsl(var(--foreground))] hover:opacity-90 transition">
                      Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PendingVerifications
