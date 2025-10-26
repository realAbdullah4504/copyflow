import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Submission } from "@/types";
import { FileText } from "lucide-react";

interface ViewSubmissionModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly submission: Submission | null;
}

export function ViewSubmissionModal({ open, onOpenChange, submission }: ViewSubmissionModalProps) {
  if (!submission) return null;

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      printed: "bg-green-100 text-green-800",
      censored: "bg-red-100 text-red-800",
      flagged: "bg-orange-100 text-orange-800",
    };

    return (
      <Badge className={`${statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Submission Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Teacher</p>
              <p className="mt-1">{submission.teacherName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="mt-1">{getStatusBadge(submission.status)}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Subject</p>
              <p className="mt-1">{submission.subject}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Grade</p>
              <p className="mt-1">{submission.grade}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Copies</p>
              <p className="mt-1">{submission.copies}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Paper Color</p>
              <p className="mt-1 capitalize">{submission.paperColor}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Double Sided</p>
              <p className="mt-1">{submission.printSettings.doubleSided ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Stapled</p>
              <p className="mt-1">{submission.printSettings.stapled ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Color</p>
              <p className="mt-1">{submission.printSettings.color ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Urgency</p>
              <p className="mt-1 capitalize">{submission.urgency}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="mt-1 whitespace-pre-line">{submission.notes || 'No notes provided'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Files</p>
              <div className="mt-1 space-y-2">
                {submission.files && submission.files.length > 0 ? (
                  submission.files.map((fileName) => (
                    <div key={`file-${fileName}`} className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{fileName}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No files attached</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Submitted on {format(new Date(submission.createdAt), 'MMM d, yyyy h:mm a')}
            </p>
            {submission.updatedAt !== submission.createdAt && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated on {format(new Date(submission.updatedAt), 'MMM d, yyyy h:mm a')}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
