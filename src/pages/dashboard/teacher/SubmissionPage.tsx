import React from "react";
import { useSubmissionsByTeacher } from "@/hooks/useSubmissions";
import { useAuth } from "@/hooks/useAuth";
import { SubmissionTable } from "@/components/submissions";
import { SUBMISSION_COLUMNS } from "@/components/submissions/columns/columnsDef";
import { Button } from "@/components/ui/button";

const SubmissionPage = () => {
  const { user } = useAuth();
  const { submissions, isLoading } = useSubmissionsByTeacher(user?.id || "");
  const columns = SUBMISSION_COLUMNS.TEACHER;
  return (
    <>
      <Button>Add Submission</Button>
      <SubmissionTable
        title="All Submissions"
        data={submissions}
        columns={columns}
        isLoading={isLoading}
      />
      <NewSubmissionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        teacherId={user.id}
        teacherName={user.name}
      />
    </>
  );
};

export default SubmissionPage;
