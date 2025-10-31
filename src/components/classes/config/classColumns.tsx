import type { ColumnDef } from "@tanstack/react-table";
import type { ClassEntity } from "@/types";
import ClassActionCell from "../cells/ClassActionCell";

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
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ getValue }) => (getValue<boolean>() ? "Active" : "Inactive"),
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
