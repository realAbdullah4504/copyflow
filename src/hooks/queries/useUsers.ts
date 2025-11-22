import { QUERY_KEYS } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services";
export const useUsers = (adminId?: string) => {
  const queryKey = [QUERY_KEYS.USERS, adminId];
  const { data, isLoading, ...rest } = useQuery({
    queryKey,
    queryFn: async () => userService.getUsers(adminId),
  });
  return {
    users: data?.users || [],
    isLoading,
    ...rest,
  };
};
