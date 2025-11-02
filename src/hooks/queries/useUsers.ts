import { QUERY_KEYS } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services";
export const useUsers = () => {
  const queryKey = [QUERY_KEYS.USERS];
  const { data, isLoading, ...rest } = useQuery({
    queryKey,
    queryFn: async () => userService.getUsers(),
  });
  return {
    users: data?.users || [],
    isLoading,
    ...rest,
  };
};
