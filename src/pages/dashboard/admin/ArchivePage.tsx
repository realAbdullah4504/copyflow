import { PageHeader } from "@/components/common";
import {
  getArchiveColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useTableParams, useArchivedSubmissions, useModal } from "@/hooks";
import type { Submission } from "@/types";
export default function AdminArchivePage() {
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
  const { modal, openModal, closeModal } = useModal<Submission>();
  const handleAction = (action: string, row: Submission) =>
    openModal(action, row);
  const columns = getArchiveColumns(ROLES.ADMIN, handleAction);
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
        handlers={{}}
      />
    </>
  );
}
