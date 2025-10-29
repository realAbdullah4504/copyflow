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
import { useState } from "react";
import type { PaginationState } from "@tanstack/react-table";

const SecretarySubmissionsPage = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 7,
  });
  const { submissions, total, isLoading } = useAllSubmissions(pagination);

  const { deleteSubmission, printedSubmission, censorSubmission } =
    useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();

  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id);
    closeModal();
  };

  const handlePrintedConfirm = () => {
    if (!modal.data) return;

    printedSubmission(modal.data.id, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleCensorshipConfirm = () => {
    if (!modal.data) return;
    censorSubmission(modal.data.id, {
      onSuccess: () => {
        closeModal();
      },
    });
  };
  const handleAction = (action: string, row: Submission) =>
    openModal(action, row);

  const columns = getSubmissionColumns(ROLES.SECRETARY, handleAction);

  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.SECRETARY}
        sideAction={() => openModal("newSubmission")}
      />
      <SubmissionTable
        data={submissions}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        total={total}
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
          onPrintedConfirm: handlePrintedConfirm,
          onCensorshipConfirm: handleCensorshipConfirm,
        }}
      />
    </>
  );
};

export default SecretarySubmissionsPage;
