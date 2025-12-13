import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { PageHeader } from "@/components/common";
import {
  useAllSubmissions,
  useSubmissionMutations,
  useModal,
  useCreateNotification,
  useAuth,
} from "@/hooks";
import {
  getAllowedActions,
  SUBMISSION_ALLOWED_ACTIONS,
  submissionPolicy,
} from "@/config";

const SecretarySubmissionsPage = () => {
  const adminId = useAuth().user?.adminId;
  const { submissions, total, isLoading } = useAllSubmissions(adminId!);
  const { createNotification } = useCreateNotification();
  const { user } = useAuth();

  const {
    deleteSubmission,
    printedSubmission,
    censorSubmission,
    censorLoading,
    printedLoading,
    deleteLoading,
  } = useSubmissionMutations();

  const { modal, openModal, closeModal } = useModal<Submission>();
  const permissions = submissionPolicy(ROLES.SECRETARY);

  const handlers = {
    onDeleteConfirm: () => {
      if (!modal.data) return;
      deleteSubmission(modal.data.id, {
        onSuccess: () => {
          createNotification({
            senderId: user?.id || "",
            senderRole: ROLES.SECRETARY,
            message: `${modal.data?.class?.label} ${modal.data?.fileType} submission deleted by ${user?.name}`,
            type: "deleteSubmission",
            teacherId: modal.data?.teacherId || "",
          });
          closeModal();
        },
      });
    },
    onPrintedConfirm: () => {
      if (!modal.data) return;
      printedSubmission(modal.data.id, {
        onSuccess: () => {
          createNotification({
            senderId: user?.id || "",
            senderRole: ROLES.SECRETARY,
            message: `${modal.data?.class?.label} ${modal.data?.fileType} submission archived by ${user?.name}`,
            type: "archiveSubmission",
            teacherId: modal.data?.teacherId || "",
          });
          closeModal();
        },
      });
    },
    onCensorshipConfirm: () => {
      if (!modal.data) return;
      censorSubmission(modal.data.id, {
        onSuccess: () => {
          createNotification({
            senderId: user?.id || "",
            senderRole: ROLES.SECRETARY,
            message: `${modal.data?.class?.label} ${modal.data?.fileType} submission censored by ${user?.name}`,
            type: "censoredSubmission",
            teacherId: modal.data?.teacherId || "",
          });
          closeModal();
        },
      });
    },
  };

  const handleAction = (action: string, row: Submission) =>
    openModal(action, row);

  const handleRowClick = (row: Submission) => {
    if (permissions.canViewSubmission()) {
      openModal("view", row);
    }
  };

  const allowedActions = getAllowedActions(
    SUBMISSION_ALLOWED_ACTIONS,
    ROLES.SECRETARY
  );

  const columns = getSubmissionColumns(
    ROLES.SECRETARY,
    allowedActions as string[],
    handleAction
  );

  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.SECRETARY}
        buttonTitle="New Submission"
        sideAction={() => openModal("newSubmission")}
      />

      <SubmissionTable
        data={submissions}
        columns={columns}
        showUrgent={true}
        total={total}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />

      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        handlers={handlers}
        allowTeacherSelection={!!ROLES.SECRETARY}
        allowedActions={allowedActions}
        isSubmitting={{
          deleteLoading,
          censorLoading,
          printedLoading,
        }}
      />
    </>
  );
};

export default SecretarySubmissionsPage;
