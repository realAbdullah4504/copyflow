import type { User } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { getRoleBadgeVariant } from "./tableUtils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const getUsersColumns = (
  onEdit: (user: User) => void,
  onDelete: (userId: string) => void
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit?.(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete?.(row.original.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ),
  },
];
