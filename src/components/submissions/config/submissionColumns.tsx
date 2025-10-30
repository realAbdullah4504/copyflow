import type { ColumnDef } from "@tanstack/react-table";
import type { Submission, SubmissionStatus } from "@/types";
import ActionCell from "../cells/ActionCell";
import type { Role } from "@/config";
import { StatusBadge } from "../ui/status-badge";
import { SUBMISSION_ACTION_CONFIG } from "../actions";
import {
  getAllowedActions,
  SUBMISSION_ALLOWED_ACTIONS,
} from "@/config/permissions";

const ROLE_COLUMNS: Record<Role, ColumnDef<Submission>[]> = {
  admin: [{ accessorKey: "teacherName", header: "Teacher", enableSorting: true }],
  teacher: [],
  secretary: [{ accessorKey: "teacherName", header: "Teacher", enableSorting: true }],
  principal: [{ accessorKey: "teacherName", header: "Teacher", enableSorting: true }],
};

export const getSubmissionColumns = (
  role: Role,
  onAction?: (action: string, row: Submission) => void
): ColumnDef<Submission>[] => {
  const actions = getAllowedActions(SUBMISSION_ALLOWED_ACTIONS, role);
  const config = SUBMISSION_ACTION_CONFIG;
  const hasActions = Array.isArray(actions) && actions.length > 0;

  const baseColumns: ColumnDef<Submission>[] = [
    ...(ROLE_COLUMNS[role] ?? []),
    { accessorKey: "subject", header: "Subject", enableSorting: true },
    { accessorKey: "grade", header: "Grade", enableSorting: true },
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
      enableSorting: true,
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
