import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionModal,
  SubmissionTable,
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
import { toast } from "sonner";

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
    openModal(action, row);
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
      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        handlers={{
          onDeleteConfirm: handleDeleteConfirm,
          onArchiveConfirm: handleArchiveConfirm,
          onCensorshipConfirm: handleCensorshipConfirm,
        }}
      />
    </>
  );
};

export default SecretarySubmissionsPage;
