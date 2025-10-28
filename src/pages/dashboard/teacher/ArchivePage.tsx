import { PageHeader } from "@/components/common";
import {
  getArchiveColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useArchiveSubmissionsByTeacher } from "@/hooks/queries";
import { useModal } from "@/hooks/useModal";
import type { Submission } from "@/types";
import { useSubmissionMutations } from "@/hooks/mutations";
import { useAuth } from "@/hooks/useAuth";
export default function TeacherArchivePage() {
  const { user } = useAuth();
  const { submissions } = useArchiveSubmissionsByTeacher(user?.id || "");
  const { deleteSubmission } = useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();
  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id);
    closeModal();
  };
  const handleAction = (action: string, row: Submission) =>
    openModal(action, row);
  const columns = getArchiveColumns(ROLES.TEACHER, handleAction);
  return (
    <>
      <PageHeader title="Archive Submissions" role={ROLES.TEACHER} />
      <SubmissionTable data={submissions} columns={columns} />
      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        handlers={{
          onDeleteConfirm: handleDeleteConfirm,
        }}
      />
    </>
  );
}
