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
import { useAuth } from "@/hooks/useAuth";
import {
  getAllowedActions,
  SUBMISSION_ALLOWED_ACTIONS,
  submissionPolicy,
} from "@/config";

const SubmissionPage = () => {
  const { user } = useAuth();
  const adminId = user!.id;
  const { submissions, isLoading } = useAllSubmissions(adminId);
  const { modal, openModal, closeModal } = useModal<Submission>();
  const policy = submissionPolicy(ROLES.ADMIN);

  const handleAction = (action: string, row: Submission) => {
    openModal(action, row);
  };

  const handleRowClick = (row: Submission) => {
    if (policy.canViewSubmission()) {
      openModal("view", row);
    }
  };

  const allowedActions = getAllowedActions(
    SUBMISSION_ALLOWED_ACTIONS,
    ROLES.ADMIN
  );

  const columns = getSubmissionColumns(
    ROLES.ADMIN,
    allowedActions as string[],
    handleAction
  );
  return (
    <>
      <PageHeader title="All Submissions" role={ROLES.ADMIN} />
      <SubmissionTable
        data={submissions}
        columns={columns}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />
      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        teacherId=""
      />
    </>
  );
};

export default SubmissionPage;
