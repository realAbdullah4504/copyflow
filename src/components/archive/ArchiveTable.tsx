import { DataTable } from "../common";
import type { Submission } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Printer } from "lucide-react";

interface ArchiveTableProps {
  data: Submission[];
  isLoading?: boolean;
  onDownload: (submission: Submission) => void;
  onDelete: (id: string) => void;
  onPrint: (submission: Submission) => void;
  isAdminView?: boolean;
}

const ArchiveTable = ({
  data,
  isLoading,
  onDownload,
  onDelete,
  onPrint,
  isAdminView = false,
}: ArchiveTableProps) => {
  const columns: ColumnDef<Submission>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title || 'Untitled Document'}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: "Submitted At",
      cell: ({ row }) => {
        const date = row.original.submittedAt || row.original.createdAt;
        return date ? new Date(date).toLocaleDateString() : 'N/A';
      },
    },
    ...(isAdminView
      ? [
          {
            accessorKey: "submittedBy",
            header: "Submitted By",
            cell: ({ row }) => {
              const user = row.original.submittedBy || row.original.teacher;
              return user?.name || 'Unknown';
            },
          },
        ]
      : []),
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload(row.original)}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPrint(row.original)}
            title="Print"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original.id)}
            title="Delete"
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-md border">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyState="No archived submissions found"
      />
    </div>
  );
};

export default ArchiveTable;
