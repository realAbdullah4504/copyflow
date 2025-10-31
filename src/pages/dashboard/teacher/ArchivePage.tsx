import { PageHeader } from "@/components/common";
import { getArchiveColumns, SubmissionTable } from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useArchiveSubmissionsByTeacher } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { useTableParams } from "@/hooks";
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
  const columns = getArchiveColumns(ROLES.TEACHER);
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
    </>
  );
}
