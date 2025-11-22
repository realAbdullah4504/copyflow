import { PageHeader } from "@/components/common";
import {
  getArchiveColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { ARCHIVE_ALLOWED_ACTIONS, getAllowedActions } from "@/config";
import { ROLES } from "@/config/roles";
import {
  useTableParams,
  useArchivedSubmissions,
  useModal,
  useAuth,
} from "@/hooks";
import type { Submission } from "@/types";
export default function AdminArchivePage() {
  const { user } = useAuth();
  const {
    pagination,
    setPagination,
    filters,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
  } = useTableParams();
  const { submissions, total, isLoading } = useArchivedSubmissions(user!.id, {
    pagination,
    filters,
    sorting,
  });
  const { modal, openModal, closeModal } = useModal<Submission>();
  const handleAction = (action: string, row: Submission) =>
    openModal(action, row);

  const handleRowClick = (row: Submission) => {
    if (allowedActions.includes("view")) {
      openModal("view", row);
    }
  };
  const allowedActions = getAllowedActions(
    ARCHIVE_ALLOWED_ACTIONS,
    ROLES.ADMIN
  );
  const columns = getArchiveColumns(
    ROLES.ADMIN,
    allowedActions as string[],
    handleAction
  );
  return (
    <>
      <PageHeader title="Archive Submissions" role={ROLES.ADMIN} />
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
        onRowClick={handleRowClick}
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
      />
    </>
  );
}
