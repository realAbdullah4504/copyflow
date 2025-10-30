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
import { useState, useEffect } from "react";
import type {
  PaginationState,
  ColumnFiltersState,
} from "@tanstack/react-table";

const SecretarySubmissionsPage = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 7,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const submissionParams = { pagination, columnFilters };
  const setSubmissionParams = { setPagination, setColumnFilters };

  const { submissions, total, isLoading } = useAllSubmissions(submissionParams);

  const { deleteSubmission, printedSubmission, censorSubmission } =
    useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();

  useEffect(() => {
    if (setPagination) {
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    }
  }, [columnFilters, setPagination]);

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
        submissionParams={submissionParams}
        setSubmissionParams={setSubmissionParams}
        total={total}
        isLoading={isLoading}
        showFilters
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
