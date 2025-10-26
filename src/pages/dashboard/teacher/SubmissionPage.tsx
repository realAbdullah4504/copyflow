import React from "react";
import { Plus } from "lucide-react";
import { useSubmissionsByTeacher } from "@/hooks/useSubmissions";
import { useAuth } from "@/hooks/useAuth";
import NewSubmissionModal from "@/components/submissions/NewSubmissionModal";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { getSubmissionColumns } from "@/components/submissions/columnsDef";
import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import { SubmissionTable } from "@/components/submissions";

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
