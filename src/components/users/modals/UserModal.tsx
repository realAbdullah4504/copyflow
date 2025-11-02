import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/common";
import UserForm from "./UserForm";
import type { User } from "@/types";
import type { ModalActionType } from "@/hooks";

interface UserModalProps {
  type: ModalActionType;
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  handlers: {
    onDeleteConfirm?: () => void;
    onEditConfirm?: (data: User) => void;
    onAddConfirm?: (data: Omit<User, "id">) => void;
  };
  isSubmitting: boolean;
  isDeletingUser: boolean;
}

const UserModal = ({
  type,
  user,
  open,
  onOpenChange,
  onClose,
  handlers,

  isSubmitting,
}: UserModalProps) => {
  if (type === "deleteUser" && user) {
    return (
      <ConfirmModal
        open={open}
        onOpenChange={onOpenChange}
        title="Delete User"
        buttonTitle="Delete"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={() => handlers.onDeleteConfirm?.()}
        isSubmitting={isSubmitting}
        onCancel={onClose}
      />
    );
  }

  const title = user ? "Edit User" : "User Details";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <UserForm
          user={user}
          onSubmit={(data) =>
            user
              ? handlers.onEditConfirm?.(data as User)
              : handlers.onAddConfirm?.(data as Omit<User, "id">)
          }
          isSubmitting={isSubmitting}
          submitText={"Save"}
          disabled={false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
