import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionTable,
  ViewSubmissionModal,
  EditSubmissionModal,
  NewSubmissionModal,
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
        openModal("view", row);
        break;
      case "edit":
        openModal("edit", row);
        break;
      case "delete":
        console.log("delete action pressed", row);
        openModal("delete", row);
        break;
    }
  };

  const handleSubmissionUpdated = () => {
    // This will trigger a refetch of submissions if needed
    // The submissions list should automatically update via React Query
    closeModal();
  };

  const columns = getSubmissionColumns(ROLES.ADMIN, handleAction);

  return (
    <>
      <PageHeader title="All Submissions" role={ROLES.ADMIN} onNew={() => {openModal("newSubmission", { teacherId: "", teacherName: "" })}} />
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

      {modal.type === "view" && modal.data && (
        <ViewSubmissionModal
          open={modal.type === "view"}
          onOpenChange={(open) => !open && closeModal()}
          submission={modal.data}
        />
      )}

      {modal.type === "edit" && modal.data && (
        <EditSubmissionModal
          open={modal.type === "edit"}
          onOpenChange={(open) => !open && closeModal()}
          submission={modal.data}
          onSuccess={handleSubmissionUpdated}
        />
      )}
      {modal.type === "newSubmission" && (
        <NewSubmissionModal
          open={modal.type === "newSubmission"}
          onOpenChange={(open) => !open && closeModal()}
          teacherId={modal.data?.teacherId || ""}
          teacherName={modal.data?.teacherName || ""}
        />
      )}
    </>
  );
};

export default AdminSubmissionsPage;
