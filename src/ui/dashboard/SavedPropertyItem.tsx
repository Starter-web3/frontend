import React from 'react';

interface Property {
  id: number;
  title: string;
}

const SavedPropertyItem: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <div className='bg-[hsl(var(--foreground)/0.1)] p-4 rounded-lg border border-[hsl(var(--border))] flex justify-between items-center hover:bg-[hsl(var(--foreground)/0.2)] transition-all duration-300'>
      <p className='font-inter text-[hsl(var(--foreground))]'>{property.title}</p>
      <div className='flex space-x-2'>
        <button className='text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-[hsl(var(--foreground))] transition'>
          View
        </button>
        <button className='text-xs bg-[hsl(var(--foreground)/0.2)] hover:bg-[hsl(var(--foreground)/0.3)] px-3 py-1 rounded text-[hsl(var(--foreground))] transition'>
          Remove
        </button>
      </div>
    </div>
  );
};

export default SavedPropertyItem;
