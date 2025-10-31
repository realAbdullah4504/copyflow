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
import { useTableParams } from "@/hooks";
export default function SecretaryArchivePage() {
  const {
    pagination,
    setPagination,
    filters,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
  } = useTableParams();
  const { submissions, total, isLoading } = useArchivedSubmissions({
    pagination,
    filters,
    sorting,
  });
  const { deleteSubmission } = useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();
  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id);
    closeModal();
  };
  const handleAction = (action: string, row: Submission) =>
    openModal(action, row);
  const columns = getArchiveColumns(ROLES.SECRETARY, handleAction);
  return (
    <>
      <PageHeader title="Archive Submissions" role={ROLES.SECRETARY} />
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
        showSorting
      />
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
