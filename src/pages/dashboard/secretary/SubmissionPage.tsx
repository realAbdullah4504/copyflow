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

const SecretarySubmissionsPage = () => {
  const { submissions, total, isLoading } = useAllSubmissions();
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

  const columns = getSubmissionColumns(ROLES.SECRETARY, handleAction);

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
        total={total}
        isLoading={isLoading}
      />

      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        handlers={handlers}
        allowTeacherSelection={!!ROLES.SECRETARY}
        isSubmitting={deleteLoading || censorLoading || printedLoading}
      />
    </>
  );
};

export default SecretarySubmissionsPage;
