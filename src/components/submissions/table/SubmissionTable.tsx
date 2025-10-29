import { DataTable } from "@/components/common";
import { Card } from "@/components/ui/card";
import type { Submission } from "@/types";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import { useMemo } from "react";
import PaginationControls from "./PaginationControls";

interface SubmissionTableProps {
  data: Submission[];
  columns: ColumnDef<Submission>[];
  pagination?: PaginationState;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
  total?: number;
  isLoading?: boolean;
}

const SubmissionTable = ({
  data,
  columns,
  pagination,
  setPagination,
  total,
  isLoading,
}: SubmissionTableProps) => {
  const tableData = useMemo(
    () => (total ? data.slice(0, total) : data),
    [data, total]
  );

  const table = useReactTable<Submission>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount:
      total && pagination?.pageSize
        ? Math.ceil(total / pagination.pageSize)
        : undefined,
  });
  return (
    <Card className="p-6 space-y-4">
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
