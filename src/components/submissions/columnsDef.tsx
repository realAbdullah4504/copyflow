import type { ColumnDef } from "@tanstack/react-table";
import type { Submission } from "@/types";
import ActionCell from "./ActionCell";
import type { ActionType, Role } from "@/config";

const ROLE_COLUMNS: Record<Role, ColumnDef<Submission>[]> = {
  admin: [{ accessorKey: "teacherName", header: "Teacher" }],
  teacher: [],
  secretary: [],
  principal: [],
};

export const getSubmissionColumns = (
  role: Role,
  onAction: (action: ActionType, row: Submission) => void
): ColumnDef<Submission>[] => {
  const baseColumns: ColumnDef<Submission>[] = [
    ...(ROLE_COLUMNS[role] ?? []),
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionCell role={role} rowData={row.original} onAction={onAction} />
      ),
    },
  ];

  return baseColumns;
};
