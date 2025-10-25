import React from "react";
import { DataTable } from "../common";
import type { Submission } from "@/types";
import type { Column } from "../common/DataTable";

interface SubmissionTableProps {
  data: Submission[];
  columns: Column<Submission>[];
  isLoading?: boolean;
  title?: string;
}

const SubmissionTable = ({
  data,
  columns,
  isLoading,
  title = "Submissions",
}: SubmissionTableProps) => {
  return (
    <div>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        title={title}
      />
    </div>
  );
};

export default SubmissionTable;
