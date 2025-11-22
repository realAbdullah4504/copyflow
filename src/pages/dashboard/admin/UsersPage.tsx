import * as React from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserModal, UsersTable } from "@/components/users";
import { useUsers, useUserMutations, useModal, useAuth } from "@/hooks";
import type { User } from "@/types";
import { getUsersColumns } from "@/components/users/userColumns";
import { showPasswordToast } from "@/components/users/PasswordToast";

const UsersPage = () => {
  const { user } = useAuth();
  const { users, isLoading } = useUsers(user?.id);
  const {
    createUser,
    updateUser,
    deleteUser,
    isCreatingUser,
    isUpdatingUser,
    isDeletingUser,
    requestPasswordReset,
    isResettingPassword,
  } = useUserMutations();
  const { modal, openModal, closeModal } = useModal<User>();

  const handlers = {
    onDeleteConfirm: () => {
      if (!modal.data) return;
      deleteUser(modal.data.id, { onSuccess: closeModal });
    },
    onEditConfirm: (data: Omit<User, "id">) => {
      if (!modal.data) return;
      updateUser({ id: modal.data.id, ...data }, { onSuccess: closeModal });
    },
    onAddConfirm: (data: Omit<User, "id">) => {
      createUser(
        { user: data, adminId: user!.id },
        {
          onSuccess: (response) => {
            closeModal();
            showPasswordToast({ password: response.password });
          },
        }
      );
    },
    onResetPasswordConfirm: () => {
      if (!modal.data) return;
      requestPasswordReset(modal.data.id, { onSuccess: closeModal });
    },
  };
  const handleEditUser = (user: User) => openModal("editUser", user);
  const handleDeleteUser = (user: User) => openModal("deleteUser", user);
  const handleRequestPasswordReset = (user: User) =>
    openModal("resetPassword", user);

  const columns = getUsersColumns(
    handleEditUser,
    handleDeleteUser,
    handleRequestPasswordReset
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage teachers and secretaries in your organization
          </p>
        </div>
        <Button onClick={() => openModal("newUser")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UsersTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        total={users.length}
      />

      <UserModal
        user={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        handlers={handlers}
        isSubmitting={
          isCreatingUser ||
          isUpdatingUser ||
          isDeletingUser ||
          isResettingPassword
        }
      />
    </div>
  );
};

export default UsersPage;
