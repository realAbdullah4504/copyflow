import type { ColumnDef } from "@tanstack/react-table";
import type { Submission } from "@/types";
import { ROLES, type Role } from "@/config/roles";
import ActionCell from "./ActionCell";

export const getSubmissionColumns = (
  role: Role,
  onAction: (action: string, row: Submission) => void
): ColumnDef<Submission>[] => {
  const baseColumns: ColumnDef<Submission>[] = [
    { accessorKey: "subject", header: "Subject" },
    { accessorKey: "grade", header: "Grade" },
    {
      accessorKey: "fileType",
      header: "Type",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        return val.replace("_", " ");
      },
    },
    { accessorKey: "status", header: "Status" },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
    },
  ];

  if (role === ROLES.ADMIN) {
    baseColumns.unshift({ accessorKey: "teacherName", header: "Teacher" });
  }

  baseColumns.push({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ActionCell role={role} rowData={row.original} onAction={onAction} />
    ),
  });

  return baseColumns;
};
