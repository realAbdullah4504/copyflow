'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoveHorizontal as MoreHorizontal, Printer, Eye, Flag, Trash2, CircleCheck as CheckCircle } from 'lucide-react';
import { useUpdateSubmission, useDeleteSubmission } from '@/hooks/useSubmissions';
import { toast } from 'sonner';
import { Submission } from '@/types';

interface SubmissionActionsProps {
  submission: Submission;
}

export function SubmissionActions({ submission }: SubmissionActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const updateSubmission = useUpdateSubmission();
  const deleteSubmission = useDeleteSubmission();

  const handleMarkPrinted = async () => {
    try {
      await updateSubmission.mutateAsync({
        id: submission.id,
        updates: { status: 'printed' }
      });
      toast.success('Marked as printed');
    } catch (error) {
      toast.error('Failed to update submission');
    }
  };

  const handleSendToCensorship = async () => {
    try {
      await updateSubmission.mutateAsync({
        id: submission.id,
        updates: { status: 'censored' }
      });
      toast.success('Sent to review');
    } catch (error) {
      toast.error('Failed to update submission');
    }
  };

  const handleFlag = async () => {
    try {
      await updateSubmission.mutateAsync({
        id: submission.id,
        updates: { status: 'flagged' }
      });
      toast.success('Submission flagged');
    } catch (error) {
      toast.error('Failed to update submission');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubmission.mutateAsync(submission.id);
      toast.success('Submission deleted');
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete submission');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => toast.info('View file - Mock action')}>
            <Eye className="mr-2 h-4 w-4" />
            View File
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info('Print - Mock action')}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </DropdownMenuItem>
          {submission.status !== 'printed' && (
            <DropdownMenuItem onClick={handleMarkPrinted}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Printed
            </DropdownMenuItem>
          )}
          {submission.status !== 'censored' && (
            <DropdownMenuItem onClick={handleSendToCensorship}>
              <Flag className="mr-2 h-4 w-4" />
              Send to Review
            </DropdownMenuItem>
          )}
          {submission.status !== 'flagged' && (
            <DropdownMenuItem onClick={handleFlag}>
              <Flag className="mr-2 h-4 w-4 text-red-600" />
              Flag as Urgent
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this submission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
