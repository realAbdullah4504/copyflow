import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import type { User } from "@/types/user";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "./mutationHandlers";

export const useUserMutations = () => {
  const createUser = useMutation({
    mutationFn: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => 
      userService.createUser(user),
    ...mutationHandlers({
      successMessage: "User created successfully",
      invalidateKeys: [QUERY_KEYS.USERS],
    }),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<User>) => 
      userService.updateUser(id, updates),
    ...mutationHandlers({
      successMessage: "User updated successfully",
      invalidateKeys: [QUERY_KEYS.USERS],
    }),
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    ...mutationHandlers({
      successMessage: "User deleted successfully",
      invalidateKeys: [QUERY_KEYS.USERS],
    }),
  });

  return {
    createUser:createUser.mutate,
    isCreatingUser: createUser.isPending,
    updateUser:updateUser.mutate,
    isUpdatingUser: updateUser.isPending,
    deleteUser:deleteUser.mutate,
    isDeletingUser: deleteUser.isPending,
  };
};
