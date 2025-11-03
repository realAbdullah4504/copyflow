import type { ColumnDef } from "@tanstack/react-table";
import type { ClassEntity, Submission, SubmissionStatus, User } from "@/types";
import ActionCell from "../cells/ActionCell";
import type { Role } from "@/config";
import { StatusBadge } from "../ui/status-badge";
import { CENSORSHIP_ACTION_CONFIG } from "../actions";
import {
  CENSORSHIP_ALLOWED_ACTIONS,
  getAllowedActions,
} from "@/config/permissions";

const ROLE_COLUMNS: Record<Role, ColumnDef<Submission>[]> = {
  admin: [
    {
      accessorKey: "teacher",
      header: "Teacher",
      cell: ({ getValue }) => {
        const val = getValue<User>();
        return val.name;
      },
    },
  ],
  teacher: [],
  secretary: [
    {
      accessorKey: "teacher",
      header: "Teacher",
      cell: ({ getValue }) => {
        const val = getValue<User>();
        return val.name;
      },
    },
  ],
  principal: [
    {
      accessorKey: "teacher",
      header: "Teacher",
      cell: ({ getValue }) => {
        const val = getValue<User>();
        return val.name;
      },
    },
  ],
};

export const getCensorshipColumns = (
  role: Role,
  onAction?: (action: string, row: Submission) => void
): ColumnDef<Submission>[] => {
  const actions = getAllowedActions(CENSORSHIP_ALLOWED_ACTIONS, role);
  const config = CENSORSHIP_ACTION_CONFIG;
  const hasActions = Array.isArray(actions) && actions.length > 0;

  const baseColumns: ColumnDef<Submission>[] = [
    ...(ROLE_COLUMNS[role] ?? []),
    {
      accessorKey: "class",
      header: "Class",
      cell: ({ getValue }) => {
        const val = getValue<ClassEntity>();
        return val.label;
      },
      enableSorting: false,
    },
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
