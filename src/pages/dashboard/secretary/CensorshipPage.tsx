import { PageHeader } from "@/components/common";
import {
  getCensorshipColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { CENSORSHIP_ALLOWED_ACTIONS, getAllowedActions } from "@/config";
import { ROLES } from "@/config/roles";
import {
  useAuth,
  useCensoredSubmissions,
  useCreateNotification,
  useSubmissionMutations,
} from "@/hooks";
import { useModal } from "@/hooks/useModal";
import type { Submission } from "@/types";

export default function SecretaryCensorshipPage() {
  const { user } = useAuth();
  const adminId = user?.adminId;
  const { submissions, isLoading } = useCensoredSubmissions(adminId!);
  const { modal, openModal, closeModal } = useModal<Submission>();

  const { unCensorSubmission, unCensorLoading } = useSubmissionMutations();

  const { createNotification } = useCreateNotification();

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

  const allowedActions = getAllowedActions(
    CENSORSHIP_ALLOWED_ACTIONS,
    ROLES.SECRETARY
  );

  const columns = getCensorshipColumns(
    ROLES.SECRETARY,
    allowedActions as string[],
    handleAction
  );

  const handleRowClick = (row: Submission) => {
    if (allowedActions.includes("view")) {
      openModal("view", row);
    }
  };

  return (
    <>
      <PageHeader title="Censorship Queue" role={ROLES.SECRETARY} />
      <SubmissionTable
        data={submissions}
        columns={columns}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />
      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        allowedActions={allowedActions}
        handlers={{
          onUnCensorshipConfirm: handleUnCensorshipConfirm,
        }}
        isSubmitting={{
          unCensorLoading,
        }}
      />
    </>
  );
}
