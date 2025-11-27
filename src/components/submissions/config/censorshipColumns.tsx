import type { ColumnDef } from "@tanstack/react-table";
import type { ClassEntity, Submission, SubmissionStatus, User } from "@/types";
import ActionCell from "../cells/ActionCell";
import type { Role } from "@/config";
import { StatusBadge } from "../ui/status-badge";
import { CENSORSHIP_ACTION_CONFIG } from "../actions";
import { format, parseISO } from "date-fns";

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
  allowedActions: string[],
  onAction?: (action: string, row: Submission) => void
): ColumnDef<Submission>[] => {
  
  const config = CENSORSHIP_ACTION_CONFIG;
  const hasActions = Array.isArray(allowedActions) && allowedActions.length > 0;

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
          accessorKey: "lessonDate",
          header: "Lesson Date",
          cell: ({ getValue }) => {
            const val = getValue<string>();
            return val ? format(parseISO(val), "MM/dd/yyyy") : "";
          },
          enableSorting: false,
        },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => {
        const val = getValue<string>();
        if (!val) return "";
        const date = new Date(val);
        // Format as MM/DD/YYYY
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
  ];

  if (hasActions) {
    baseColumns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionCell
          actions={allowedActions}
          actionsConfig={config}
          rowData={row.original}
          onAction={onAction}
        />
      ),
    });
  }

  return baseColumns;
};
