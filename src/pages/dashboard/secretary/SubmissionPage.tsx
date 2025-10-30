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
import { useTableParams } from "@/hooks";

const SecretarySubmissionsPage = () => {
  const {
    pagination,
    setPagination,
    filters,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
  } = useTableParams();

  const { submissions, total, isLoading } = useAllSubmissions({
    pagination,
    filters,
    sorting,
  });

  const { deleteSubmission, printedSubmission, censorSubmission } =
    useSubmissionMutations();

  const { modal, openModal, closeModal } = useModal<Submission>();

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, setPagination, sorting]);

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
        sideAction={() => openModal("newSubmission")}
      />

      <SubmissionTable
        data={submissions}
        columns={columns}
        pagination={pagination}
        columnFilters={columnFilters}
        sorting={sorting}
        total={total}
        isLoading={isLoading}
        onPaginationChange={setPagination}
        onColumnFiltersChange={setColumnFilters}
        onSortingChange={setSorting}
        showFilters
        showPagination
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
