import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UsersTable } from "@/components/users";
import { useUsers, useUserMutations, useModal } from "@/hooks";
import type { User } from "@/types";
import UserModal from "@/components/users/UserModal";
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

  const handleAddUser = () => {
    openModal("newUser");
  };

  const handleEditUser = (user: User) => {
    openModal("editUser", user);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId);
    }
  };

  const handleSubmit = async (userData: Omit<User, "id">, userId?: string) => {
    if (userId) {
      updateUser({
        id: userId,
        ...userData,
      });
    } else {
      createUser(userData);
    }
    closeModal();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage teachers and secretaries in your organization
          </p>
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UsersTable
        data={users}
        columns={getUsersColumns(handleEditUser, handleDeleteUser)}
        isLoading={isLoading}
        total={users.length}
      />

      <UserModal
        isOpen={
          modal.isOpen &&
          (modal.type === "newUser" || modal.type === "editUser")
        }
        onClose={closeModal}
        user={modal.data}
        onSubmit={handleSubmit}
        isSubmitting={
          modal.type === "newUser"
            ? isCreatingUser
            : modal.type === "editUser"
            ? isUpdatingUser
            : false
        }
      />
    </div>
  );
};

export default UsersPage;
