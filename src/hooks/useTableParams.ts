import { useState, useMemo } from "react";
import type {
  PaginationState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { toFilterObject } from "@/utils";

export const useTableParams = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const filters = useMemo(() => toFilterObject(columnFilters), [columnFilters]);

  return {
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    filters,
  };
};
