import { PageHeader } from "@/components/common";
import {
  getCensorshipColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useAuth, useCensoredSubmissions, useCreateNotification, useSubmissionMutations } from "@/hooks";
import { useModal } from "@/hooks/useModal";
import type { Submission } from "@/types";

export default function SecretaryCensorshipPage() {
  const { submissions, isLoading } = useCensoredSubmissions();
  const { modal, openModal, closeModal } = useModal<Submission>();
  const {user}=useAuth()

  const { unCensorSubmission } = useSubmissionMutations();

  const { createNotification } = useCreateNotification();

  const handleDeleteConfirm = () => {};

  const handleUnCensorshipConfirm = () => {
    if (!modal.data) return;
    unCensorSubmission(modal.data.id, {
      onSuccess: () => {
        createNotification({
            senderId: user?.id || "",
            senderRole: ROLES.SECRETARY,
            message: `${modal.data?.class?.label} ${modal.data?.fileType} submission approved by ${user?.name}`,
            type: "approvedSubmission",
            teacherId: modal.data?.teacherId || "",
          });
        closeModal();
      },
    });
  };

  const handleAction = (action: string, row: Submission) => {
    openModal(action, row);
  };

  const columns = getCensorshipColumns(ROLES.SECRETARY, handleAction);

  return (
    <>
      <PageHeader title="Censorship Queue" role={ROLES.SECRETARY} />
      <SubmissionTable
        data={submissions}
        columns={columns}
        isLoading={isLoading}
      />
      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        handlers={{
          onDeleteConfirm: handleDeleteConfirm,
          onUnCensorshipConfirm: handleUnCensorshipConfirm,
        }}
      />
    </>
  );
}
