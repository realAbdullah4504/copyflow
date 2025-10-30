import { useState, useMemo, useEffect } from "react";
import type {
  PaginationState,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { toFilterObject } from "@/utils";

export const useTableParams = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const filters = useMemo(() => toFilterObject(columnFilters), [columnFilters]);
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, setPagination, sorting]);

  return {
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    filters,
  };
};
