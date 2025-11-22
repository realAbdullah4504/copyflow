import type { ModalActionType } from "@/hooks/useModal";
import type { ClassEntity, ClassEntityV2, GradeLevel } from "@/types";
import NewClassModal from "./NewClassModal";
import EditClassModal from "./EditClassModal";
import { ConfirmModal } from "@/components/common";
interface Props {
  type: ModalActionType;
  data?: ClassEntityV2;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  isSubmitting?: boolean;
  grade:GradeLevel;
  adminId: string;
  handlers: {
    onDeleteConfirm?: () => void;
    onToggleActiveConfirm?: () => void;
  };
}

const ClassModal = ({
  data,
  grade,
  adminId,
  type,
  open,
  onOpenChange,
  onClose,
  isSubmitting,
  handlers,
}: Props) => {
  if (!type) return null;
  switch (type) {
    case "newClass":
      return <NewClassModal open={open} onOpenChange={onOpenChange} grade={grade} adminId={adminId} />;
    case "editClass":
      return (
        data && (
          <EditClassModal
            open={open}
            classData={data}
            onOpenChange={(open) => !open && onClose()}
            grade={grade}
            adminId={adminId}
          />
        )
      );
    case "deleteClass":
      return (
        handlers.onDeleteConfirm &&
        data && (
          <ConfirmModal
            open={open}
            onOpenChange={onOpenChange}
            isSubmitting={isSubmitting}
            title="Delete Class"
            buttonTitle="Delete"
            description="Are you sure you want to delete this class? This action cannot be undone."
            onConfirm={() => handlers.onDeleteConfirm?.()}
            onCancel={onClose}
          />
        )
      );
    case "toggleActive":
      return (
        handlers.onToggleActiveConfirm &&
        data && (
          <ConfirmModal
            open={open}
            onOpenChange={onOpenChange}
            isSubmitting={isSubmitting}
            title={data.active ? "Deactivate Class" : "Activate Class"}
            buttonTitle={data.active ? "Deactivate" : "Activate"}
            description={`Are you sure you want to ${
              data.active ? "deactivate" : "activate"
            } this class?`}
            onConfirm={() => handlers.onToggleActiveConfirm?.()}
            onCancel={onClose}
          />
        )
      );
    default:
      return null;
  }
};

export default ClassModal;
