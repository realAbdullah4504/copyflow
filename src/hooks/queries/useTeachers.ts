import { QUERY_KEYS } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services";
export const useTeachers = (adminId: string, status?: boolean) => {
  const queryKey = [QUERY_KEYS.TEACHERS, adminId, status];
  const { data, isLoading, ...rest } = useQuery({
    queryKey,
    queryFn: async () => userService.getTeachers(adminId, status),
  });
  return {
    teachers: data || [],
    isLoading,
    ...rest,
  };
};
