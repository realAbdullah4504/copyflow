import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Submission } from '@/types/domain/submission';
import { useCensoredSubmissions } from '@/hooks/useSubmissions';
import CensorshipTable from './CensorshipTable';

// Implementation of these functions will be added when the backend is ready
const downloadSubmission = async (id: string): Promise<void> => {
  console.log('Downloading submission:', id);
  // TODO: Implement actual file download when backend is ready
};

const deleteSubmission = async (id: string): Promise<void> => {
  console.log('Deleting submission:', id);
  // TODO: Implement actual deletion when backend is ready
};

const CensorshipContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: censoredSubmissions = [], isLoading } = useCensoredSubmissions();
  
  const filteredSubmissions = censoredSubmissions.filter(submission => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return [
      submission.subject,
      submission.teacherName,
      submission.grade,
      submission.fileType,
      submission.notes
    ].some(field => field?.toLowerCase().includes(searchLower));
  });

  const handleDownload = async (submission: Submission) => {
    try {
      await downloadSubmission(submission.id);
      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download submission');
    }
  };

  const handleDelete = async (submissionId: string) => {
    if (globalThis.confirm('Are you sure you want to permanently delete this submission?')) {
      try {
        await deleteSubmission(submissionId);
        toast.success('Submission deleted successfully');
      } catch (error) {
        console.error('Error deleting submission:', error);
        toast.error('Failed to delete submission');
      }
    }
  };

  const handlePrint = (submission: Submission) => {
    console.log('Printing submission:', submission.id);
    // TODO: Implement print functionality
    globalThis.print();
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
          <h1 className="text-2xl font-bold tracking-tight">Censored Submissions</h1>
          <p className="text-muted-foreground">View and manage censored submissions</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search censored..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <CensorshipTable
        data={filteredSubmissions}
        isLoading={isLoading}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onPrint={handlePrint}
      />
    </div>
  );
};

export default CensorshipContent;
