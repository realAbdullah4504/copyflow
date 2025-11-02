import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/common";
import UserForm from "./UserForm";
import type { User } from "@/types";

type UserModalAction = "view" | "edit" | "delete" | "new";

interface UserModalProps {
  type: UserModalAction;
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSubmit: (userData: Omit<User, "id">, userId?: string) => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

const UserModal = ({
  type,
  user,
  open,
  onOpenChange,
  onClose,
  onSubmit,
  onDelete,
  isSubmitting,
}: UserModalProps) => {
  const handleSubmit = (data: any) => {
    onSubmit(data, user?.id);
  };

  if (type === "delete" && user) {
    return (
      <ConfirmModal
        open={open}
        onOpenChange={onOpenChange}
        title="Delete User"
        buttonTitle="Delete"
        description="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={onDelete}
        onCancel={onClose}
      />
    );
  }

  const isViewMode = type === "view";
  const title = user
    ? isViewMode
      ? "User Details"
      : "Edit User"
    : "Add New User";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitText={isViewMode ? "Close" : "Save"}
          disabled={isViewMode}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
