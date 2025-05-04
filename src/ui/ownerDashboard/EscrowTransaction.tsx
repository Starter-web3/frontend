import React from 'react';

interface Transaction {
  id: number;
  property: string;
  status: 'In Progress' | 'Completed';
  amount: string;
}

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  return (
    <tr className='border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--foreground)/0.1)] transition-colors'>
      <td className='px-4 py-3 whitespace-nowrap text-sm'>{transaction.property}</td>
      <td className='px-4 py-3 whitespace-nowrap text-sm'>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            transaction.status === 'In Progress'
              ? 'bg-blue-600 text-[hsl(var(--foreground))]'
              : 'bg-green-600 text-[hsl(var(--foreground))]'
          }`}
        >
          {transaction.status}
        </span>
      </td>
      <td className='px-4 py-3 whitespace-nowrap text-sm'>{transaction.amount}</td>
      <td className='px-4 py-3 whitespace-nowrap text-sm'>
        <button  className=' bg-[#F0E2F70D] text-gray-300 border border-[#F8F8F840] hover:bg-[#252525] shadow-md px-4 py-2 w-[80px] rounded-3xl text-xs transition'>
          {transaction.status === 'In Progress' ? 'View' : 'Receipt'}
        </button>
      </td>
    </tr>
  );
};

export default TransactionItem;