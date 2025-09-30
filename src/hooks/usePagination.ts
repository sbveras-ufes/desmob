import { useState, useMemo } from 'react';

export const usePagination = <T>(items: T[], initialItemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = useMemo(() => Math.ceil(items.length / itemsPerPage), [items.length, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    if (items.length === 0) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages || 1));
    setCurrentPage(pageNumber);
  };
  
  const goToFirstPage = () => {
    setCurrentPage(1);
  };
  
  const goToLastPage = () => {
    if (totalPages > 0) {
      setCurrentPage(totalPages);
    }
  };

  const changeItemsPerPage = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page
  };

  const startIndex = items.length > 0 ? (currentPage - 1) * itemsPerPage : -1;
  const endIndex = items.length > 0 ? Math.min(startIndex + itemsPerPage, items.length) : -1;

  return {
    currentPage,
    totalPages,
    paginatedItems,
    itemsPerPage,
    startIndex,
    endIndex,
    totalItems: items.length,
    nextPage,
    prevPage,
    goToPage,
    goToFirstPage,
    goToLastPage,
    changeItemsPerPage,
  };
};