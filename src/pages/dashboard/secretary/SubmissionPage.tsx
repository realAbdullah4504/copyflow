import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  EditSubmissionModal,
  getSubmissionColumns,
  NewSubmissionModal,
  SubmissionTable,
  ViewSubmissionModal,
} from "@/components/submissions";
import { useDeleteSubmission, useSubmissions } from "@/hooks/useSubmissions";
import { DeleteModal, PageHeader } from "@/components/common";
import { type ActionType } from "@/config";
import { useModal } from "@/hooks/useModal";
import { teachers } from "../admin/SubmissionsPage";

const SecretarySubmissionsPage = () => {
  const { submissions } = useSubmissions();
  const { mutate: deleteSubmission } = useDeleteSubmission();
  const { modal, openModal, closeModal } = useModal<Submission>();

  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id);
    closeModal();
  };

  const handleAction = (action: ActionType, row: Submission) => {
    switch (action) {
      case "view":
        openModal("view", row);
        break;
      case "edit":
        openModal("edit", row);
        break;
      case "delete":
        openModal("delete", row);
        break;
    }
  };

  const columns = getSubmissionColumns(ROLES.SECRETARY, handleAction);

  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.SECRETARY}
        onNew={() => openModal("newSubmission")}
      />
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
      {modal.type === "edit" && modal.data && (
        <EditSubmissionModal
          open={modal.type === "edit"}
          onOpenChange={(open) => !open && closeModal()}
          submission={modal.data}
        />
      )}
      {modal.type === "view" && modal.data && (
        <ViewSubmissionModal
          open={modal.type === "view"}
          onOpenChange={(open) => !open && closeModal()}
          submission={modal.data}
        />
      )}
      <NewSubmissionModal
        open={modal.type === "newSubmission"}
        onOpenChange={(open) => !open && closeModal()}
        teacherOptions={teachers}
      />
    </>
  );
};

export default SecretarySubmissionsPage;
