import { useState } from "react";
import { Icon } from "@/utils/icon";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onAdd?: () => void;
  addLabel?: string;
  actionsLabel?: string;
  // Pagination props
  totalRecords?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Buscar...",
  onEdit,
  onDelete,
  onView,
  onAdd,
  addLabel = "Nuevo",
  actionsLabel = "Acciones",
  totalRecords,
  pageSize: propPageSize = 7,
  onPageChange,
  currentPage: propCurrentPage,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [internalPage, setInternalPage] = useState(1);
  const isServerSide = totalRecords !== undefined && onPageChange !== undefined;
  const pageSize = propPageSize;
  
  // Use our new hook to handle all calculations
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    pages,
    hasNextPage,
    hasPrevPage
  } = usePagination({
    total: isServerSide ? totalRecords : (data.filter(item => {
      if (!searchTerm || !searchKey) return true;
      const value = item[searchKey];
      if (typeof value === "string" || typeof value === "number") {
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    }).length),
    skip: (isServerSide ? (propCurrentPage || 1) - 1 : (internalPage - 1)) * pageSize,
    limit: pageSize
  });

  const filteredData = data.filter((item) => {
    if (!searchTerm || !searchKey) return true;
    const value = item[searchKey];
    if (typeof value === "string" || typeof value === "number") {
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const paginatedData = isServerSide ? filteredData : filteredData.slice(startIndex - 1, startIndex - 1 + pageSize);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      if (isServerSide) {
        onPageChange(page);
      } else {
        setInternalPage(page);
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Table Header / Search & Add */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-sm group">
          <Icon 
            name="search" 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" 
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              goToPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-sm"
          />
        </div>

        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            <Icon name="add" size="sm" />
            <span>{addLabel}</span>
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-background border border-outline-variant/20 rounded-3xl overflow-hidden shadow-sm flex flex-col">
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20">
                {columns.map((col, i) => (
                  <th 
                    key={i} 
                    className={cn(
                      "px-6 py-4 text-[10px] font-black uppercase tracking-widest text-outline",
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-outline text-right">
                    {actionsLabel}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Icon name="progress_activity" className="animate-spin text-4xl text-primary" />
                      <p className="text-sm font-bold uppercase tracking-widest text-outline">Cargando datos...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-primary/5 transition-colors group"
                  >
                    {columns.map((col, i) => (
                      <td 
                        key={i} 
                        className={cn(
                          "px-6 py-4 text-sm text-on-surface font-medium",
                          col.className
                        )}
                      >
                        {typeof col.accessor === "function" 
                          ? col.accessor(item) 
                          : (item[col.accessor] as React.ReactNode)}
                      </td>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl text-outline hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                              title="Ver detalles"
                            >
                              <Icon name="visibility" size="sm" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl text-outline hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
                              title="Editar"
                            >
                              <Icon name="edit" size="sm" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl text-outline hover:text-error hover:bg-error/10 transition-all active:scale-90"
                              title="Eliminar"
                            >
                              <Icon name="delete" size="sm" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={columns.length + 1} 
                    className="px-6 py-20 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Icon name="search_off" size="2xl" />
                      <p className="text-sm font-bold uppercase tracking-widest">No se encontraron resultados</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 0 && (
          <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-xs text-outline font-medium">
                Mostrando <span className="font-bold text-on-surface">{startIndex}</span> a <span className="font-bold text-on-surface">{endIndex}</span> de <span className="font-bold text-on-surface">{isServerSide ? totalRecords : filteredData.length}</span> registros
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={!hasPrevPage}
                onClick={() => goToPage(currentPage - 1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-background border border-outline-variant/30 text-outline hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-outline disabled:hover:border-outline-variant/30 transition-all active:scale-90"
              >
                <Icon name="chevron_left" size="sm" />
              </button>
              
              <div className="flex items-center gap-1">
                {pages.map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={cn(
                      "w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs transition-all",
                      currentPage === page 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-outline hover:bg-primary/10 hover:text-primary"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={!hasNextPage}
                onClick={() => goToPage(currentPage + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-background border border-outline-variant/30 text-outline hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-outline disabled:hover:border-outline-variant/30 transition-all active:scale-90"
              >
                <Icon name="chevron_right" size="sm" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
