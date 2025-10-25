import React from "react";
import { Plus } from "lucide-react";
import { useSubmissionsByTeacher } from "@/hooks/useSubmissions";
import { useAuth } from "@/hooks/useAuth";
import { SUBMISSION_COLUMNS, SubmissionTable } from "@/components/submissions";
import NewSubmissionModal from "@/components/submissions/NewSubmissionModal";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";

const SubmissionPage = () => {
  const { user } = useAuth();
  const { submissions, isLoading } = useSubmissionsByTeacher(user?.id || "");
  const columns = SUBMISSION_COLUMNS.TEACHER;
  const [modalOpen, setModalOpen] = React.useState(false);
  return (
    <>
      <PageHeader
        title="All Submissions"
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Submission
          </Button>
        }
      />
      <SubmissionTable
        data={submissions}
        columns={columns}
        isLoading={isLoading}
      />
      <NewSubmissionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        teacherId={user?.id || ""}
        teacherName={user?.name || ""}
      />
    </>
  );
};

export default SubmissionPage;
