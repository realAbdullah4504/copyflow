import { PageHeader } from "@/components/common";
import { ROLES } from "@/config/roles";
import {
  getSubmissionColumns,
  SubmissionTable,
} from "@/components/submissions";
import { useAllSubmissions } from "@/hooks/queries";
import { useTableParams } from "@/hooks";

const SubmissionPage = () => {
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


  const columns = getSubmissionColumns(ROLES.ADMIN);
  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.ADMIN}
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
        showSorting
      />
    </>
  );
};

export default SubmissionPage;
