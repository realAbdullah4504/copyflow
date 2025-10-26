import React from "react";
import { useSubmissionsByTeacher } from "@/hooks/useSubmissions";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/common";
import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  NewSubmissionModal,
  SubmissionTable,
} from "@/components/submissions";

const SubmissionPage = () => {
  const { user } = useAuth();
  const { submissions, isLoading } = useSubmissionsByTeacher(user?.id || "");
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleAction = (action: string, row: Submission) => {
    if (action === "view") {
      console.log("Viewing", row);
    } else if (action === "edit") {
      console.log("Editing", row);
    } else if (action === "delete") {
      console.log("Deleting", row);
    }
  };
  const columns = getSubmissionColumns(ROLES.TEACHER, handleAction);
  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.TEACHER}
        onNew={() => setModalOpen(true)}
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
