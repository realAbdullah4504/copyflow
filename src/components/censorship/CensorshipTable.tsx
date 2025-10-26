import { DataTable } from "@/components/common";
import type { Submission, SubmissionStatus } from "@/types/domain/submission";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Printer } from "lucide-react";

interface SubjectCellProps {
  subject?: string;
  teacherName?: string;
  grade?: string;
}

const SubjectCell = ({ subject, teacherName, grade }: SubjectCellProps) => (
  <div className="font-medium">
    <div>{subject || 'No Subject'}</div>
    <div className="text-sm text-muted-foreground">
      {teacherName} • {grade}
    </div>
  </div>
);

interface StatusBadgeProps {
  status: SubmissionStatus | 'unknown';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusColors = {
    censored: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    printed: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    flagged: 'bg-orange-100 text-orange-800',
    default: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status as keyof typeof statusColors] || statusColors.default
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

interface ActionsCellProps {
  submission: Submission;
  onDownload: (submission: Submission) => void;
  onDelete: (id: string) => void;
  onPrint: (submission: Submission) => void;
}

const ActionsCell = ({ submission, onDownload, onDelete, onPrint }: ActionsCellProps) => (
  <div className="flex space-x-2">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onDownload(submission)}
      title="Download"
    >
      <Download className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onPrint(submission)}
      title="Print"
    >
      <Printer className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onDelete(submission.id)}
      title="Delete"
      className="text-destructive hover:text-destructive/90"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

interface CensorshipTableProps {
  data: Submission[];
  isLoading?: boolean;
  onDownload: (submission: Submission) => void;
  onDelete: (id: string) => void;
  onPrint: (submission: Submission) => void;
}

const CensorshipTable = ({
  data,
  isLoading,
  onDownload,
  onDelete,
  onPrint,
}: CensorshipTableProps) => {
  const columns: ColumnDef<Submission>[] = [
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <SubjectCell
          subject={row.original.subject}
          teacherName={row.original.teacherName}
          grade={row.original.grade}
        />
      ),
    },
    {
      accessorKey: "fileType",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.fileType?.replace('_', ' ') || 'Document'}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status || 'unknown'} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return date ? new Date(date).toLocaleDateString() : 'N/A';
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionsCell
          submission={row.original}
          onDownload={onDownload}
          onDelete={onDelete}
          onPrint={onPrint}
        />
      ),
    },
  ];

  if (isLoading || !data) {
    return (
      <div className="rounded-md border p-4 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border p-4 text-center text-muted-foreground">
        No censored submissions found
      </div>
    );
  }

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
};

export default CensorshipTable ;
