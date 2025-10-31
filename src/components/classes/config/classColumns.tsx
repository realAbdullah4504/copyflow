import type { ColumnDef } from "@tanstack/react-table";
import type { ClassEntity } from "@/types";
import ClassActionCell from "../cells/ClassActionCell";
import { cn } from "@/utils";

export const getClassColumns = (
  handlers: {
    onEdit?: (row: ClassEntity) => void;
    onToggle?: (row: ClassEntity) => void;
    onDelete?: (row: ClassEntity) => void;
  } = {}
): ColumnDef<ClassEntity>[] => {
  return [
    { accessorKey: "subject", header: "Subject" },
    { accessorKey: "grade", header: "Grade" },
    // Update the status cell to include background colors
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ getValue }) => {
        const isActive = getValue<boolean>();
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
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ClassActionCell
          row={row.original}
          onEdit={handlers.onEdit}
          onToggle={handlers.onToggle}
          onDelete={handlers.onDelete}
        />
      ),
    },
  ];
};
