import { PageHeader } from "@/components/common";
import {
  getArchiveColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { ROLES } from "@/config/roles";
import {
  useArchiveSubmissionsByTeacher,
  useAuth,
  useModal,
  useTableParams,
} from "@/hooks";
import type { Submission } from "@/types";
export default function TeacherArchivePage() {
  const {
    pagination,
    setPagination,
    filters,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
  } = useTableParams();
  const { user } = useAuth();
  const { submissions, total, isLoading } = useArchiveSubmissionsByTeacher(
    user?.id || "",
    {
      pagination,
      filters,
      sorting,
    }
  );
  const { modal, openModal, closeModal } = useModal<Submission>();
  const handleAction = (action: string, row: Submission) =>
    openModal(action, row);
  const columns = getArchiveColumns(ROLES.TEACHER, handleAction);
  return (
    <>
      <PageHeader title="Archive Submissions" role={ROLES.TEACHER} />
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
