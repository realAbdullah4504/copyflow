import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionTable,
} from "@/components/submissions";
import { useSubmissions } from "@/hooks/useSubmissions";
import { DeleteModal, PageHeader } from "@/components/common";
import { type ActionType } from "@/config";
import { useModal } from "@/hooks/useModal";

const AdminSubmissionsPage = () => {
  const { submissions } = useSubmissions();
  const { modal, openModal, closeModal } = useModal<Submission>();

  const handleDeleteConfirm = () => {
    console.log("delete confirmed", modal.data);
    closeModal();
  };

  const handleAction = (action: ActionType, row: Submission) => {
    switch (action) {
      case "view":
        // maybe navigate
        console.log("Viewing", row);
        break;
      case "edit":
        // maybe open an edit modal
        console.log("Editing", row);
        break;
      case "delete":
        console.log("delete action pressed", row);
        openModal("delete", row);
        break;
    }
  };

  const columns = getSubmissionColumns(ROLES.ADMIN, handleAction);

  return (
    <>
      <PageHeader title="All Submissions" role={ROLES.ADMIN} onNew={() => {}} />
      <SubmissionTable data={submissions} columns={columns} />
      {modal.type === "delete" && modal.data && (
        <DeleteModal
          open={modal.type === "delete"}
          onConfirm={handleDeleteConfirm}
          onCancel={closeModal}
          title="Confirm Deletion"
          description="Are you sure you want to delete this submission?"
        />
      )}
    </>
  );
};

export default AdminSubmissionsPage;
