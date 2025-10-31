import { PageHeader } from "@/components/common";
import { getArchiveColumns, SubmissionTable } from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useArchivedSubmissions } from "@/hooks/queries";
import { useTableParams } from "@/hooks";
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
  const columns = getArchiveColumns(ROLES.ADMIN);
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
    </>
  );
}
