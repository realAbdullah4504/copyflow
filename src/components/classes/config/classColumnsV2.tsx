import type { ColumnDef } from "@tanstack/react-table";
import type { ClassesWithSchedules } from "@/types";
import { cn } from "@/utils";
import ClassActionCell from "../cells/ClassActionCell";
import { getDayLabel } from "@/constants";

export const getClassV2Columns = (
  handlers: {
    onEdit?: (row: ClassesWithSchedules) => void;
    onToggle?: (row: ClassesWithSchedules) => void;
    onDelete?: (row: ClassesWithSchedules) => void;
  } = {}
): ColumnDef<ClassesWithSchedules>[] => {
  return [
    {
      accessorKey: "teacher",
      header: "Teacher",
      cell: ({ row }) => {
        const teacher = row.original.teacher;
        return <span>{teacher?.name || "N/A"}</span>;
      },
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "lessonDays",
      header: "Lesson Days",
      cell: ({ row }) => {
        const days = row.original.lessonDays;

        if (!days?.length) return "—";

        return days.map((d) => getDayLabel(d)).join(", ");
      },
    },
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
