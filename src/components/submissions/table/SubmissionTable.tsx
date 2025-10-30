import { DataTable } from "@/components/common";
import { Card } from "@/components/ui/card";
import type { Submission } from "@/types";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type PaginationState,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo } from "react";
import PaginationControls from "./PaginationControls";
import SubmissionFilters from "./SubmissionFilters";

interface SubmissionTableProps {
  data: Submission[];
  columns: ColumnDef<Submission>[];
  pagination?: PaginationState;
  columnFilters?: ColumnFiltersState;
  sorting?: SortingState;
  onColumnFiltersChange?: React.Dispatch<
    React.SetStateAction<ColumnFiltersState>
  >;
  onPaginationChange?: React.Dispatch<React.SetStateAction<PaginationState>>;
  onSortingChange?: React.Dispatch<React.SetStateAction<SortingState>>;
  total?: number;
  isLoading?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  showSorting?: boolean;
}

const SubmissionTable = ({
  data,
  columns,
  pagination,
  columnFilters,
  sorting,
  onPaginationChange,
  onColumnFiltersChange,
  onSortingChange,
  total,
  isLoading,
  showFilters = false,
  showPagination = true,
  showSorting = false,
}: SubmissionTableProps) => {
  const tableData = useMemo(
    () => (total ? data.slice(0, total) : data),
    [data, total]
  );

  const table = useReactTable<Submission>({
    data: tableData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    state: {
      pagination,
      columnFilters,
      sorting,
    },
    onPaginationChange,
    onColumnFiltersChange,
    onSortingChange,
    manualPagination: true,
    manualSorting: true,
    pageCount:
      total && pagination?.pageSize
        ? Math.ceil(total / pagination.pageSize)
        : undefined,
  });

  return (
    <Card className="p-6 space-y-4">
      {showFilters && columnFilters && (
        <SubmissionFilters table={table} data={tableData} />
      )}
      <DataTable<Submission>
        table={table}
        columns={columns}
        isLoading={isLoading}
        showSorting={showSorting}
      />
      {showPagination && pagination && onPaginationChange && (
        <PaginationControls table={table} />
      )}
    </Card>
  );
};

export default SubmissionTable;
