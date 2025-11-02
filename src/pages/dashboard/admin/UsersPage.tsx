import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserModal, UsersTable } from "@/components/users";
import { useUsers, useUserMutations, useModal } from "@/hooks";
import type { User } from "@/types";
import { getUsersColumns } from "@/components/users/userColumns";

const UsersPage = () => {
  const { users, isLoading } = useUsers();
  const {
    createUser,
    updateUser,
    deleteUser,
    isCreatingUser,
    isUpdatingUser,
    isDeletingUser,
  } = useUserMutations();
  const { modal, openModal, closeModal } = useModal<User>();

  const handlers = {
    onDeleteConfirm: () => {
      if (!modal.data) return;
      deleteUser(modal.data.id);
      closeModal();
    },
    onEditConfirm: (data: User) => {
      updateUser(
        { ...data },
        { onSuccess: closeModal }
      );
    },
    onAddConfirm: (data: Omit<User, "id">) => {
      createUser(data, { onSuccess: closeModal });
    },
  };
  const handleEditUser = (user: User) => openModal("editUser", user);
  const handleDeleteUser = (user: User) => openModal("deleteUser", user);

  const columns = getUsersColumns(handleEditUser, handleDeleteUser);

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
        isSubmitting={isCreatingUser || isUpdatingUser || isDeletingUser}
      />
    </div>
  );
};

export default UsersPage;
