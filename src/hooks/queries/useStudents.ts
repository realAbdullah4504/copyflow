import { useQuery } from "@tanstack/react-query";
import { studentService } from "@/services/studentService";
import { QUERY_KEYS } from "@/config";
import type { Student } from "@/types";

export const useStudents = (adminId?: string) => {
  const query = useQuery<Student[]>({
    queryKey: [QUERY_KEYS.STUDENTS, adminId],
    queryFn: () => studentService.getAll(adminId!),
    enabled: Boolean(adminId),
  });

  return {
    students: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
