import type { ColumnDef } from "@tanstack/react-table";
import type { Submission, SubmissionStatus } from "@/types";
import ActionCell from "../cells/ActionCell";
import type { Role } from "@/config";
import { StatusBadge } from "../ui/status-badge";
import { ARCHIVE_ACTION_CONFIG} from "../actions";
import {
  ARCHIVE_ALLOWED_ACTIONS,
  getAllowedActions,
} from "@/config/permissions";

const ROLE_COLUMNS: Record<Role, ColumnDef<Submission>[]> = {
  admin: [{ accessorKey: "teacherName", header: "Teacher" }],
  teacher: [],
  secretary: [{ accessorKey: "teacherName", header: "Teacher" }],
  principal: [{ accessorKey: "teacherName", header: "Teacher" }],
};

export const getArchiveColumns = (
  role: Role,
  onAction: (action: string, row: Submission) => void
): ColumnDef<Submission>[] => {
  const actions = getAllowedActions(ARCHIVE_ALLOWED_ACTIONS, role);
  const config = ARCHIVE_ACTION_CONFIG;
  const hasActions = Array.isArray(actions) && actions.length > 0;

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
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const val = getValue<SubmissionStatus>();
        return <StatusBadge status={val} />;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
    },
  ];

  if (hasActions) {
    baseColumns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionCell
          actions={actions as string[]}
          actionsConfig={config}
          rowData={row.original}
          onAction={onAction}
        />
      ),
    });
  }

  return baseColumns;
};
