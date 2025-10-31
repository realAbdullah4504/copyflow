import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/common";
import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { useModal } from "@/hooks/useModal";
import { useSubmissionsByTeacher } from "@/hooks/queries";
import { useSubmissionMutations } from "@/hooks/mutations";
import { useTableParams } from "@/hooks";

const SubmissionPage = () => {
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
  const { submissions, isLoading, total } = useSubmissionsByTeacher(
    user?.id || "",
    {
      pagination,
      filters,
      sorting,
    }
  );
  const { deleteSubmission } = useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();

  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleAction = (action: string, row: Submission) => {
    openModal(action, row);
  };
  const columns = getSubmissionColumns(ROLES.TEACHER, handleAction);
  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.TEACHER}
        sideAction={() => openModal("newSubmission")}
      />
      <SubmissionTable
        data={submissions}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        columnFilters={columnFilters}
        sorting={sorting}
        total={total}
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
};

export default SubmissionPage;
