import { DataTable } from "@/components/common";
import { Card } from "@/components/ui/card";
import type { Submission } from "@/types";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type PaginationState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useEffect, useMemo } from "react";
import PaginationControls from "./PaginationControls";
import SubmissionFilters from "./SubmissionFilters";

type submissionParams = {
  pagination?: PaginationState;
  columnFilters?: ColumnFiltersState;
};

type submissionParamsSet = {
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
  setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
};
interface SubmissionTableProps {
  data: Submission[];
  columns: ColumnDef<Submission>[];
  submissionParams?: submissionParams;
  setSubmissionParams?: submissionParamsSet;
  total?: number;
  isLoading?: boolean;
  showFilters?: boolean;
}

const SubmissionTable = ({
  data,
  columns,
  submissionParams,
  setSubmissionParams,
  total,
  isLoading,
  showFilters = false,
}: SubmissionTableProps) => {
  const tableData = useMemo(
    () => (total ? data.slice(0, total) : data),
    [data, total]
  );

  const { pagination, columnFilters } = submissionParams || {};
  const { setPagination, setColumnFilters } = setSubmissionParams || {};

  const table = useReactTable<Submission>({
    data: tableData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    state: {
      pagination,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: true,
    pageCount:
      total && pagination?.pageSize
        ? Math.ceil(total / pagination.pageSize)
        : undefined,
  });

  return (
    <Card className="p-6 space-y-4">
      {showFilters && <SubmissionFilters table={table} data={tableData} />}
      <DataTable<Submission>
        table={table}
        columns={columns}
        isLoading={isLoading}
      />
      {pagination && setPagination && <PaginationControls table={table} />}
    </Card>
  );
};

export default SubmissionTable;
