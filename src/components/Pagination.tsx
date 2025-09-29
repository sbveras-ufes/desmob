import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between py-3 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span>Registros por página</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="p-1 border border-gray-300 rounded-md"
        >
          {[10, 20, 30, 50, 100].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4">
        <span>{startItem}-{endItem} de {totalItems}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-1 disabled:opacity-50">
            <ChevronsLeft size={20} />
          </button>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1 disabled:opacity-50">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1 disabled:opacity-50">
            <ChevronRight size={20} />
          </button>
          <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-1 disabled:opacity-50">
            <ChevronsRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;