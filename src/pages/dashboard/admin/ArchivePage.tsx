import { PageHeader } from "@/components/common";
import {
  getArchiveColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useArchivedSubmissions } from "@/hooks/queries";
import { useModal } from "@/hooks/useModal";
import type { Submission } from "@/types";
import { useSubmissionMutations } from "@/hooks/mutations";
export default function AdminArchivePage() {
  const { submissions } = useArchivedSubmissions();
  const { deleteSubmission } = useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();
  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id);
    closeModal();
  };
  const handleAction = (action: string, row: Submission) =>
    openModal(action, row);
  const columns = getArchiveColumns(ROLES.ADMIN, handleAction);
  return (
    <>
      <PageHeader title="Archive Submissions" role={ROLES.ADMIN} />
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
