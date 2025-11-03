import type { User } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { getRoleBadgeVariant } from "./tableUtils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Pencil, Trash2, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

export const getUsersColumns = (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void,
  onRequestPasswordReset?: (user: User) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {row.original.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge className={getRoleBadgeVariant(row.original.role)}>
        {row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1)}
      </Badge>
    ),
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.active ?? true;
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit?.(row.original)}
          title="Edit user"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete?.(row.original)}
          title="Delete user"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRequestPasswordReset?.(row.original);
          }}
          title="Request new password"
        >
          <KeyRound className="h-4 w-4 text-blue-500" />
        </Button>
      </div>
    ),
  },
];
