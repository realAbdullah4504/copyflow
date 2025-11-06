import { PageHeader } from "@/components/common";
import { ROLES } from "@/config/roles";
import {
  getSubmissionColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { useAllSubmissions } from "@/hooks";
import { useModal } from "@/hooks/useModal";
import type { Submission } from "@/types";

const SubmissionPage = () => {
  const { submissions, isLoading } = useAllSubmissions();
  const { modal, openModal, closeModal } = useModal<Submission>();

  const handleAction = (action: string, row: Submission) => {
    openModal(action, row);
  };
  const columns = getSubmissionColumns(ROLES.ADMIN, handleAction);
  return (
    <>
      <PageHeader title="All Submissions" role={ROLES.ADMIN} />
      <SubmissionTable
        data={submissions}
        columns={columns}
        isLoading={isLoading}
      />
      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        teacherId=""
        isSubmitting={false}
        handlers={{}}
      />
    </>
  );
};

export default SubmissionPage;
