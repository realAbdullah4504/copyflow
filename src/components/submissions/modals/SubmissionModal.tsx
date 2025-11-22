import type { ModalActionType } from "@/hooks/useModal";
import type { Submission } from "@/types";
import NewSubmissionModal from "./NewSubmissionModal";
import EditSubmissionModal from "./EditSubmissionModal";
import ViewSubmissionModal from "./ViewSubmissionModal";
import { ConfirmModal } from "@/components/common";

interface Props {
  type: ModalActionType;
  data?: Submission;
  open: boolean;
  allowTeacherSelection?: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  isSubmitting?: {
    deleteLoading?: boolean;
    censorLoading?: boolean;
    printedLoading?: boolean;
    unCensorLoading?: boolean;
  };
  handlers?: {
    onDeleteConfirm?: () => void;
    onPrintedConfirm?: () => void;
    onCensorshipConfirm?: () => void;
    onUnCensorshipConfirm?: () => void;
  };
  allowedActions?: readonly string[];
  teacherId?: string;
}

const SubmissionModal = ({
  data,
  type,
  open,
  onOpenChange,
  onClose,
  isSubmitting,
  handlers,
  teacherId,
  allowTeacherSelection = false,
  allowedActions = [],
}: Props) => {
  if (!type) return null;

  switch (type) {
    case "newSubmission":
      return (
        <NewSubmissionModal
          open={open}
          onOpenChange={onOpenChange}
          allowTeacherSelection={allowTeacherSelection}
          teacherId={teacherId}
        />
      );
    case "edit":
      return (
        data && (
          <EditSubmissionModal
            open={open}
            submission={data}
            onOpenChange={(open) => !open && onClose()}
          />
        )
      );
    case "view":
      return (
        data && (
          <ViewSubmissionModal
            open={open}
            submission={data}
            onOpenChange={(open) => !open && onClose()}
            handlers={handlers}
            isSubmitting={isSubmitting}
            allowedActions={allowedActions}
          />
        )
      );
    case "delete":
      return (
        handlers?.onDeleteConfirm &&
        data && (
          <ConfirmModal
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Submission"
            buttonTitle="Delete"
            description="Are you sure you want to delete this submission?"
            onConfirm={() => handlers.onDeleteConfirm?.()}
            onCancel={onClose}
            isSubmitting={isSubmitting?.deleteLoading}
          />
        )
      );
    case "printed":
      return (
        handlers?.onPrintedConfirm &&
        data && (
          <ConfirmModal
            open={open}
            onOpenChange={onOpenChange}
            title="Printed Submission"
            buttonTitle="Printed"
            description="Are you sure you want to change the status of this submission to printed?"
            onConfirm={() => handlers.onPrintedConfirm?.()}
            onCancel={onClose}
            isSubmitting={isSubmitting?.printedLoading}
          />
        )
      );
    case "censorship":
      return (
        handlers?.onCensorshipConfirm &&
        data && (
          <ConfirmModal
            open={open}
            onOpenChange={onOpenChange}
            title="Censor Submission"
            buttonTitle="Censor"
            description="Are you sure you want to censor this submission?"
            onConfirm={() => handlers.onCensorshipConfirm?.()}
            onCancel={onClose}
            isSubmitting={isSubmitting?.censorLoading}
          />
        )
      );
    case "approve":
      return (
        handlers?.onUnCensorshipConfirm &&
        data && (
          <ConfirmModal
            open={open}
            onOpenChange={onOpenChange}
            title="Approve Submission"
            buttonTitle="Approve"
            description="Are you sure you want to approve this submission?"
            onConfirm={() => handlers.onUnCensorshipConfirm?.()}
            onCancel={onClose}
            isSubmitting={isSubmitting?.unCensorLoading}
          />
        )
      );
    default:
      return null;
  }
};

export default SubmissionModal;
