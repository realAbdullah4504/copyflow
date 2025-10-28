import { PageHeader } from "@/components/common";
import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { useModal } from "@/hooks/useModal";
import type { ActionType } from "@/config";
import { useAllSubmissions } from "@/hooks/queries";
import { useSubmissionMutations } from "@/hooks/mutations";

const SubmissionPage = () => {
  const { submissions } = useAllSubmissions();
  const { deleteSubmission } = useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();

  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id);
    closeModal();
  };

  const handleAction = (action: ActionType, row: Submission) => {
    openModal(action, row);
  };
  const columns = getSubmissionColumns(ROLES.TEACHER, handleAction);
  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.TEACHER}
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
        }}
      />
    </>
  );
};

export default SubmissionPage;
