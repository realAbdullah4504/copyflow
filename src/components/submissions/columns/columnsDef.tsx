import type { ColumnDef } from "@tanstack/react-table";
import type { Submission } from "@/types";

export const SUBMISSION_COLUMNS: Record<string, ColumnDef<Submission>[]> = {
  ADMIN: [
    {
      accessorKey: "teacherName",
      header: "Teacher",
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "grade",
      header: "Grade",
    },
    {
      accessorKey: "fileType",
      header: "Type",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value.replace("_", " ");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return new Date(date).toLocaleString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <div>{JSON.stringify(row)}</div>,
    },
  ],
  TEACHER: [
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "grade",
      header: "Grade",
    },
    {
      accessorKey: "fileType",
      header: "Type",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value.replace("_", " ");
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return new Date(date).toLocaleString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <div>{JSON.stringify(row)}</div>,
    },
  ],
};
