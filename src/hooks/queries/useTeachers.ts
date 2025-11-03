import { QUERY_KEYS } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services";
export const useTeachers = (status?: boolean) => {
  const queryKey = [QUERY_KEYS.TEACHERS];
  const { data, isLoading, ...rest } = useQuery({
    queryKey,
    queryFn: async () => userService.getTeachers(status),
  });
  return {
    teachers: data || [],
    isLoading,
    ...rest,
  };
};
