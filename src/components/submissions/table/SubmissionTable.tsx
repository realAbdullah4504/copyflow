import { DataTable } from "@/components/common";
import type { Submission } from "@/types";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";

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
  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        total={total}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SubmissionTable;
