export default function BalanceCard() {
  return (
    <div className='bg-[hsl(var(--foreground)/0.1)] rounded-lg border border-[hsl(var(--border))] flex p-6 flex-col justify-between items-center hover:bg-[hsl(var(--foreground)/0.2)] transition-all duration-300'>
      <div className="text-xl mb-2">◆ PCH Balance</div>
      <div className="text-3xl font-bold mb-1">15 ETH</div>
      <p className="text-sm text-center mb-4">
        Earn 0.1% interest every time you verify, transact, or refer someone.
      </p>
      <div className="flex gap-6">
        <button className='px-8 py-2 bg-gradient-to-r from-[hsl(var(--primary-from))] to-[hsl(var(--primary-to))] text-[hsl(var(--foreground))] rounded-3xl hover:opacity-90 transition text-sm font-medium'>
          Withdraw
        </button>
        <button className="bg-[#F0E2F70D] text-gray-300 border border-[#F8F8F840] px-8 py-2 rounded-3xl text-sm hover:bg-[#252525] shadow-md">
          Transaction History
        </button>
      </div>
    </div>
  )
}