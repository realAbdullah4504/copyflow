import { PageHeader } from "@/components/common";
import {
  getCensorshipColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useModal } from "@/hooks/useModal";
import type { Submission } from "@/types";
import { useSubmissionMutations } from "@/hooks/mutations";
import { useAuth } from "@/hooks/useAuth";
import { useCensoredSubmissionsByTeacher } from "@/hooks/queries";

export default function TeacherCensorshipPage() {
  const { user } = useAuth();
  const { submissions } = useCensoredSubmissionsByTeacher(user?.id || "");
  const { modal, openModal, closeModal } = useModal<Submission>();

  const { unCensorSubmission } = useSubmissionMutations();

  const handleDeleteConfirm = () => {};

  const handleUnCensorshipConfirm = () => {
    if (!modal.data) return;
    unCensorSubmission(modal.data.id, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleAction = (action: string, row: Submission) => {
    openModal(action, row);
  };

  const columns = getCensorshipColumns(ROLES.TEACHER, handleAction);

  return (
    <>
      <PageHeader title="Censorship Queue" role={ROLES.TEACHER} />
      <SubmissionTable data={submissions} columns={columns} />
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
