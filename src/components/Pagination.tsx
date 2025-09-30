import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  onItemsPerPageChange: (size: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  nextPage: () => void;
  prevPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  onItemsPerPageChange,
  goToFirstPage,
  goToLastPage,
  nextPage,
  prevPage,
}) => {
  if (totalItems === 0) {
    return null;
  }
    
  return (
    <div className="flex items-center justify-end space-x-6 bg-gray-50 px-4 py-2 border-t">
      <div className="flex items-center space-x-2">
        <label htmlFor="itemsPerPage" className="text-sm text-gray-700">Registros por página</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <span className="text-sm text-gray-700">
        {startIndex + 1}-{endIndex} de {totalItems}
      </span>

      <div className="flex items-center space-x-2">
        <button
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          aria-label="Primeira página"
        >
          <ChevronsLeft className="h-5 w-5" />
        </button>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
          className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          aria-label="Última página"
        >
          <ChevronsRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;