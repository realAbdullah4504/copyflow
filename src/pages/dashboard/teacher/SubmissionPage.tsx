import React from "react";
import { useSubmissionsByTeacher } from "@/hooks/useSubmissions";
import { useAuth } from "@/hooks/useAuth";
import { SubmissionTable } from "@/components/submissions";
import { SUBMISSION_COLUMNS } from "@/components/submissions/columns/columnsDef";
import { Button } from "@/components/ui/button";
import NewSubmissionModal from "@/components/submissions/NewSubmissionModal";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/common";

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
