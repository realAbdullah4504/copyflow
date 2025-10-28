import ArchiveTable from './ArchiveTable';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Submission } from '@/types';
import { useArchivedSubmissions } from '@/hooks/queries';
const ArchiveContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { submissions: archivedSubmissions = [], isLoading } = useArchivedSubmissions();
  
  const filteredSubmissions = archivedSubmissions.filter((submission: Submission) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.subject?.toLowerCase().includes(searchLower) ||
      submission.teacherName?.toLowerCase().includes(searchLower) ||
      submission.grade?.toLowerCase().includes(searchLower) ||
      submission.fileType?.toLowerCase().includes(searchLower) ||
      submission.notes?.toLowerCase().includes(searchLower)
    );
  });


  const handleDownload = async (submission: Submission) => {
    try {
      // TODO: Implement download functionality
      // await downloadSubmission(submission.id);
      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download submission');
    }
  };

  const handleDelete = async (submissionId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this submission?')) {
      try {
        // TODO: Implement delete functionality
        // await deleteSubmission(submissionId);
        toast.success('Submission deleted successfully');
      } catch (error) {
        console.error('Error deleting submission:', error);
        toast.error('Failed to delete submission');
      }
    }
  };

  const handlePrint = (submission: Submission) => {
    // TODO: Implement print functionality
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Archive</h1>
          <p className="text-muted-foreground">View and manage your archived submissions</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search archives..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ArchiveTable
        data={filteredSubmissions}
        isLoading={isLoading}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onPrint={handlePrint}
        isAdminView={false}
      />
    </div>
  )
}

export default ArchiveContent
