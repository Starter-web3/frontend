import React from 'react';

interface Transaction {
  id: number;
  property: string;
  status: 'In Progress' | 'Escrowed';
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
        <button className='px-4 py-2 rounded-3xl bg-gradient-to-r from-[hsl(var(--primary-from))] to-[hsl(var(--primary-to))] text-xs transition'>
          {transaction.status === 'In Progress' ? 'View Progress' : 'View Details'}
        </button>
      </td>
    </tr>
  );
};

export default TransactionItem;
