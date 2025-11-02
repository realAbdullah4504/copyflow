import { QUERY_KEYS } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services";
export const useTeachers = () => {
  const queryKey = [QUERY_KEYS.TEACHERS];
  const { data, isLoading, ...rest } = useQuery({
    queryKey,
    queryFn: async () => userService.getTeachers(),
  });
  return {
    teachers: data || [],
    isLoading,
    ...rest,
  };
};
