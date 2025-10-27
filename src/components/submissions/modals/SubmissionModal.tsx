import type { ModalType } from "@/hooks/useModal";
import type { Submission } from "@/types";
import NewSubmissionModal from "./NewSubmissionModal";
import EditSubmissionModal from "./EditSubmissionModal";
import ViewSubmissionModal from "./ViewSubmissionModal";
import ConfirmModal from "./ConfirmModal";

interface Props {
  type: ModalType;
  data?: Submission;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  handlers: {
    onDeleteConfirm?: () => void;
    onArchiveConfirm?: () => void;
    onCensorshipConfirm?: () => void;
  };
}

const SubmissionModal = ({
  data,
  type,
  open,
  onOpenChange,
  onClose,
  handlers,
}: Props) => {
  if (!type) return null;

  switch (type) {
    case "newSubmission":
      return <NewSubmissionModal open={open} onOpenChange={onOpenChange} />;
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
          />
        )
      );
    case "delete":
      return (
        handlers.onDeleteConfirm &&
        data && (
          <ConfirmModal
            open={open}
            title="Delete Submission"
            buttonTitle="Delete"
            description="Are you sure you want to delete this submission?"
            onConfirm={() => handlers.onDeleteConfirm?.()}
            onCancel={onClose}
          />
        )
      );
    case "archive":
      return (
        handlers.onArchiveConfirm &&
        data && (
          <ConfirmModal
            open={open}
            title="Archive Submission"
            buttonTitle="Archive"
            description="Are you sure you want to archive this submission?"
            onConfirm={() => handlers.onArchiveConfirm?.()}
            onCancel={onClose}
          />
        )
      );
    case "censorship":
      return (
        handlers.onCensorshipConfirm &&
        data && (
          <ConfirmModal
            open={open}
            title="Censor Submission"
            buttonTitle="Censor"
            description="Are you sure you want to censor this submission?"
            onConfirm={() => handlers.onCensorshipConfirm?.()}
            onCancel={onClose}
          />
        )
      );
    default:
      return null;
  }
};

export default SubmissionModal;
