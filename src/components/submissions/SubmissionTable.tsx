import { DataTable } from "../common";
import type { Submission } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

interface SubmissionTableProps {
  data: Submission[];
  columns: ColumnDef<Submission>[];
  isLoading?: boolean;
}

const SubmissionTable = ({
  data,
  columns,
  isLoading,
}: SubmissionTableProps) => {
  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SubmissionTable;
