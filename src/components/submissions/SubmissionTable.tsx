import React from "react";
import { DataTable } from "../common";
import type { Submission } from "@/types";
import type { Column } from "../common/DataTable";

interface SubmissionTableProps {
  data: Submission[];
  columns: Column<Submission>[];
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
