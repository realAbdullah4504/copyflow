import ArchiveTable from './ArchiveTable';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { getTeacherArchivedSubmissions } from "@/services/archiveService";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/hooks/useAuth';
import type { Submission } from '@/types';

const ArchiveContent = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    
    const loadArchivedSubmissions = async () => {
      try {
        setIsLoading(true);
        const data = await getTeacherArchivedSubmissions(user.id);
        setSubmissions(data);
      } catch (error) {
        console.error('Failed to load archived submissions:', error);
        toast.error('Failed to load archived submissions');
      } finally {
        setIsLoading(false);
      }
    };

    loadArchivedSubmissions();
  }, [user?.id]);

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(
    (submission) =>
      (submission.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.submittedBy?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        setSubmissions(submissions.filter(s => s.id !== submissionId));
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

  if (isLoading && submissions.length === 0) {
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
