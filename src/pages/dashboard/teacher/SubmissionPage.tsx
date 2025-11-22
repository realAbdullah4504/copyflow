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
import {
  useSubmissionsByTeacher,
  useSubmissionMutations,
  useCreateNotification,
} from "@/hooks";
import {
  getAllowedActions,
  SUBMISSION_ALLOWED_ACTIONS,
  submissionPolicy,
} from "@/config";

const SubmissionPage = () => {
  const { user } = useAuth();
  const { submissions, isLoading, total } = useSubmissionsByTeacher(
    user?.id || ""
  );
  const { createNotification } = useCreateNotification();
  const { deleteSubmission, deleteLoading } = useSubmissionMutations();
  const { modal, openModal, closeModal } = useModal<Submission>();
  const policy = submissionPolicy(ROLES.TEACHER);

  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteSubmission(modal.data.id, {
      onSuccess: () => {
        closeModal();
        createNotification({
          senderId: user?.id || "",
          senderRole: ROLES.TEACHER,
          message: `${modal.data?.class?.label} ${modal.data?.fileType} submission deleted by ${user?.name}`,
          type: "deleteSubmission",
          teacherId: user?.id || "",
        });
      },
    });
  };

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
    ROLES.TEACHER
  );

  const columns = getSubmissionColumns(
    ROLES.TEACHER,
    allowedActions as string[],
    handleAction
  );
  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.TEACHER}
        buttonTitle="New Submission"
        sideAction={() => openModal("newSubmission")}
      />
      <SubmissionTable
        data={submissions}
        columns={columns}
        isLoading={isLoading}
        total={total}
        onRowClick={handleRowClick}
      />
      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        teacherId={user?.id || ""}
        isSubmitting={{
          deleteLoading,
          censorLoading: false,
          printedLoading: false,
        }}
        handlers={{
          onDeleteConfirm: handleDeleteConfirm,
        }}
      />
    </>
  );
};

export default SubmissionPage;
