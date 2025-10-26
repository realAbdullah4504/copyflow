import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  EditSubmissionModal,
  getSubmissionColumns,
  NewSubmissionModal,
  SubmissionTable,
  ViewSubmissionModal,
} from "@/components/submissions";
import {
  useDeleteSubmission,
  useSubmissions,
  useCreateArchiveSubmission,
  useCensorSubmission,
} from "@/hooks/useSubmissions";
import { PageHeader } from "@/components/common";
import { type ActionType } from "@/config";
import { useModal } from "@/hooks/useModal";
import { teachers } from "../admin/SubmissionsPage";
import { toast } from "sonner";
import ActionModal from "@/components/common/ActionModal";

const SecretarySubmissionsPage = () => {
  const { submissions, refetch } = useSubmissions();
  const { mutate: deleteSubmission } = useDeleteSubmission();
  const { mutate: archiveSubmission } = useCreateArchiveSubmission();
  const { mutate: censorSubmission } = useCensorSubmission();
  const { modal, openModal, closeModal } = useModal<Submission>();

  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id);
    closeModal();
  };

  const handleArchiveConfirm = () => {
    if (!modal.data) return;

    archiveSubmission(modal.data.id, {
      onSuccess: () => {
        toast.success("Submission archived successfully");
        refetch();
        closeModal();
      },
      onError: (error: Error) => {
        console.error("Failed to archive submission:", error);
        toast.error("Failed to archive submission");
      },
    });
  };

  const handleCensorshipConfirm = () => {
    if (!modal.data) return;
    censorSubmission(modal.data.id, {
      onSuccess: () => {
        toast.success("Submission censored successfully");
        refetch();
        closeModal();
      },
      onError: (error: Error) => {
        console.error("Failed to censor submission:", error);
        toast.error("Failed to censor submission");
      },
    });
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
      case "archive":
        openModal("archive", row);
        break;
      case "censorship":
        openModal("censorship", row);
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
        <ActionModal
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
      {modal.type === "newSubmission" && (
        <NewSubmissionModal
          open={modal.type === "newSubmission"}
          onOpenChange={(open) => !open && closeModal()}
          teacherOptions={teachers}
        />
      )}

      {modal.type === "archive" && modal.data && (
        <ActionModal
          open={modal.type === "archive"}
          onConfirm={handleArchiveConfirm}
          onCancel={closeModal}
          buttonTitle="Archive"
          title="Confirm Archiving"
          description="Are you sure you want to archive this submission?"
        />
      )}
      {modal.type === "censorship" && modal.data && (
        <ActionModal
          open={modal.type === "censorship"}
          onConfirm={handleCensorshipConfirm}
          onCancel={closeModal}
          buttonTitle="Censor"
          title="Confirm Censorship"
          description="Are you sure you want to censor this submission?"
        />
      )}
    </>
  );
};

export default SecretarySubmissionsPage;
