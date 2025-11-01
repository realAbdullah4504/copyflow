import { useEffect } from "react";
import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { PageHeader } from "@/components/common";
import { useModal } from "@/hooks/useModal";
import { useAllSubmissions } from "@/hooks/queries";
import { useSubmissionMutations } from "@/hooks/mutations";

const SecretarySubmissionsPage = () => {
  const { submissions, total, isLoading } = useAllSubmissions();

  const { deleteSubmission, printedSubmission, censorSubmission } =
    useSubmissionMutations();

  const { modal, openModal, closeModal } = useModal<Submission>();

  const handlers = {
    onDeleteConfirm: () => {
      if (!modal.data) return;
      deleteSubmission(modal.data.id);
      closeModal();
    },
    onPrintedConfirm: () => {
      if (!modal.data) return;
      printedSubmission(modal.data.id, { onSuccess: closeModal });
    },
    onCensorshipConfirm: () => {
      if (!modal.data) return;
      censorSubmission(modal.data.id, { onSuccess: closeModal });
    },
  };

  const handleAction = (action: string, row: Submission) =>
    openModal(action, row);

  const columns = getSubmissionColumns(ROLES.SECRETARY, handleAction);

  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.SECRETARY}
        buttonTitle="New Submission"
        sideAction={() => openModal("newSubmission")}
      />

      <SubmissionTable
        data={submissions}
        columns={columns}
        total={total}
        isLoading={isLoading}
      />

      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        handlers={handlers}
      />
    </>
  );
};

export default SecretarySubmissionsPage;
