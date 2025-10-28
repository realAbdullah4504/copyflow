import { PageHeader } from "@/components/common";
import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { useModal } from "@/hooks/useModal";
import { useAllSubmissions } from "@/hooks/queries";
import { useSubmissionMutations } from "@/hooks/mutations";

const SubmissionPage = () => {
  const { submissions } = useAllSubmissions();
  const { deleteSubmission,censorSubmission } = useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();

  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id,{
      onSuccess:()=>{
        closeModal();
      }
    });
  };

  const handleCensorshipConfirm = () => {
    if (!modal.data) return;
    censorSubmission(modal.data.id,{
      onSuccess:()=>{
        closeModal();
      }
    });
  };


  const handleAction = (action: string, row: Submission) => {
    openModal(action, row);
  };
  const columns = getSubmissionColumns(ROLES.ADMIN, handleAction);
  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.ADMIN}
        sideAction={() => openModal("newSubmission")}
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
          onCensorshipConfirm: handleCensorshipConfirm,
        }}
      />
    </>
  );
};

export default SubmissionPage;
