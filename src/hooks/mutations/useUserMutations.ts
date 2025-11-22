import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "./mutationHandlers";
import type { User } from "@/types";
import { showPasswordToast } from "@/components/users/PasswordToast";

export const useUserMutations = () => {
  const createUser = useMutation({
    mutationFn: ({
      user,
      adminId,
    }: {
      user: Omit<User, "id" | "createdAt" | "updatedAt">;
      adminId: string;
    }) => userService.createUser({ user, adminId }),
    ...mutationHandlers({
      successMessage: "User created successfully",
      invalidateKeys: [QUERY_KEYS.USERS, QUERY_KEYS.TEACHERS],
    }),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<User>) =>
      userService.updateUser(id, updates),
    ...mutationHandlers({
      successMessage: "User updated successfully",
      invalidateKeys: [QUERY_KEYS.USERS, QUERY_KEYS.TEACHERS],
    }),
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    ...mutationHandlers({
      successMessage: "User deleted successfully",
      invalidateKeys: [QUERY_KEYS.USERS, QUERY_KEYS.TEACHERS],
    }),
  });

  const requestPasswordReset = useMutation({
    mutationFn: (userId: string) => userService.requestPasswordReset(userId),
    ...mutationHandlers({
      successMessage: "Password reset requested successfully",
    }),
    onSuccess: (data: { temporaryPassword: string }) => {
      showPasswordToast({ password: data.temporaryPassword });
    },
  });

  return {
    createUser: createUser.mutate,
    isCreatingUser: createUser.isPending,
    updateUser: updateUser.mutate,
    isUpdatingUser: updateUser.isPending,
    deleteUser: deleteUser.mutate,
    isDeletingUser: deleteUser.isPending,
    requestPasswordReset: requestPasswordReset.mutate,
    isResettingPassword: requestPasswordReset.isPending,
  };
};
