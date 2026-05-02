import { useMemo } from "react";

interface UsePaginationProps {
  total: number;
  skip: number;
  limit: number;
}

/**
 * usePagination calculates common pagination metadata from backend skip/limit/total values.
 * This avoids duplicating calculation logic across components and modules.
 */
export function usePagination({ total, skip, limit }: UsePaginationProps) {
  return useMemo(() => {
    const safeLimit = limit > 0 ? limit : 1;
    const currentPage = Math.floor(skip / safeLimit) + 1;
    const totalPages = Math.ceil(total / safeLimit);
    const hasNextPage = skip + limit < total;
    const hasPrevPage = skip > 0;

    return {
      currentPage,
      totalPages,
      hasNextPage,
      hasPrevPage,
      startIndex: total > 0 ? skip + 1 : 0,
      endIndex: Math.min(skip + limit, total),
      /**
       * Generates an array of page numbers to display in the UI.
       * Can be extended later to include ellipses (...) for many pages.
       */
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
    };
  }, [total, skip, limit]);
}
