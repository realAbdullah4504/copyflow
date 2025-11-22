import { PageHeader } from "@/components/common";
import {
  getArchiveColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { ARCHIVE_ALLOWED_ACTIONS, getAllowedActions } from "@/config";
import { ROLES } from "@/config/roles";
import {
  useArchivedSubmissions,
  useAuth,
  useSubmissionMutations,
  useTableParams,
} from "@/hooks";
import { useModal } from "@/hooks/useModal";
import type { Submission } from "@/types";
export default function SecretaryArchivePage() {
  const { user } = useAuth();
  const adminId = user?.adminId;
  const {
    pagination,
    setPagination,
    filters,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
  } = useTableParams();
  const { submissions, total, isLoading } = useArchivedSubmissions(adminId!, {
    pagination,
    filters,
    sorting,
  });
  const { deleteSubmission, deleteLoading } = useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();
  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id);
    closeModal();
  };
  const handleAction = (action: string, row: Submission) =>
    openModal(action, row);

  const handleRowClick = (row: Submission) => {
    if (allowedActions.includes("view")) {
      openModal("view", row);
    }
  };

  const allowedActions = getAllowedActions(
    ARCHIVE_ALLOWED_ACTIONS,
    ROLES.SECRETARY
  );
  const columns = getArchiveColumns(
    ROLES.SECRETARY,
    allowedActions as string[],
    handleAction
  );
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
        onRowClick={handleRowClick}
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
        isSubmitting={{
          deleteLoading,
        }}
      />
    </>
  );
}
