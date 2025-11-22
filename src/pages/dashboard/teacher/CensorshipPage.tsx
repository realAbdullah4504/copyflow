import { PageHeader } from "@/components/common";
import {
  getCensorshipColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useModal } from "@/hooks/useModal";
import type { Submission } from "@/types";
import {
  useCensoredSubmissionsByTeacher,
  useSubmissionMutations,
  useAuth,
} from "@/hooks";
import { CENSORSHIP_ALLOWED_ACTIONS, getAllowedActions } from "@/config";

export default function TeacherCensorshipPage() {
  const { user } = useAuth();
  const { submissions } = useCensoredSubmissionsByTeacher(user?.id || "");
  const { modal, openModal, closeModal } = useModal<Submission>();

  const { unCensorSubmission, unCensorLoading } = useSubmissionMutations();

  const handleUnCensorshipConfirm = () => {
    if (!modal.data) return;
    unCensorSubmission(modal.data.id, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleRowClick = (row: Submission) => {
    if (allowedActions.includes("view")) {
      openModal("view", row);
    }
  };

  const handleAction = (action: string, row: Submission) => {
    openModal(action, row);
  };

  const allowedActions = getAllowedActions(
    CENSORSHIP_ALLOWED_ACTIONS,
    ROLES.TEACHER
  );

  const columns = getCensorshipColumns(
    ROLES.TEACHER,
    allowedActions as string[],
    handleAction
  );

  return (
    <>
      <PageHeader title="Censorship Queue" role={ROLES.TEACHER} />
      <SubmissionTable
        data={submissions}
        columns={columns}
        onRowClick={handleRowClick}
      />
      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
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
