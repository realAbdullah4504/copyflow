
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/common";
import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { useModal } from "@/hooks/useModal";
import { useSubmissionsByTeacher } from "@/hooks/queries";
import { useSubmissionMutations } from "@/hooks/mutations";

const SubmissionPage = () => {
  const { user } = useAuth();
  const { submissions, isLoading } = useSubmissionsByTeacher(user?.id || "");
  const { deleteSubmission, archiveSubmission } = useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();

  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id);
    closeModal();
  };

  const handleArchiveConfirm = () => {
    if (!modal.data) return;
    archiveSubmission(modal.data.id);
    closeModal();
  };

  const handleAction = (action: string, row: Submission) => {
    openModal(action, row);
  };
  const columns = getSubmissionColumns(ROLES.TEACHER, handleAction);
  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.TEACHER}
        sideAction={() => openModal("newSubmission")}
      />
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
          onArchiveConfirm: handleArchiveConfirm,
        }}
      />
    </>
  );
};

export default SubmissionPage;
