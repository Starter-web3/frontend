'use client';

import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 7;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className='flex justify-center items-center py-8'>
      <div className='flex items-center gap-2'>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          variant='ghost'
          className='w-8 h-8 p-0 rounded-full bg-gray-800/50 text-white hover:bg-gray-700'
          disabled={currentPage === 1}
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only'>Previous page</span>
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            variant='ghost'
            className={`w-8 h-8 p-0 rounded-full ${
              currentPage === page
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-800/50 text-white hover:bg-gray-700'
            }`}
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          variant='ghost'
          className='w-8 h-8 p-0 rounded-full bg-gray-800/50 text-white hover:bg-gray-700'
          disabled={currentPage === totalPages}
        >
          <ChevronRight className='h-4 w-4' />
          <span className='sr-only'>Next page</span>
        </Button>
      </div>
    </div>
  );
}
