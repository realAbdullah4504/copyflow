import type { ColumnDef } from "@tanstack/react-table";
import type { Submission, SubmissionStatus } from "@/types";
import ActionCell from "../cells/ActionCell";
import { getAllowedActions, type Role } from "@/config";
import { StatusBadge } from "../ui/status-badge";
import { UrgencyBadge } from "../ui/urgency-badge";
import { CENSORSHIP_ALLOWED_ACTIONS } from "@/config/permissions/censorshipPermissions";
import { CENSORSHIP_ACTION_CONFIG } from "../actions";
const ROLE_COLUMNS: Record<Role, ColumnDef<Submission>[]> = {
  admin: [{ accessorKey: "teacherName", header: "Teacher" }],
  teacher: [],
  secretary: [],
  principal: [{ accessorKey: "teacherName", header: "Teacher" }],
};

export const getCensorshipColumns = (
  role: Role,
  onAction: (action: string, row: Submission) => void
): ColumnDef<Submission>[] => {
  const actions = getAllowedActions(CENSORSHIP_ALLOWED_ACTIONS, role);
  const actionConfig = CENSORSHIP_ACTION_CONFIG;
  
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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionCell
          actions={actions as string[]}
          actionsConfig={actionConfig}
          rowData={row.original}
          onAction={onAction}
        />
      ),
    },
  ];

  return baseColumns;
};
