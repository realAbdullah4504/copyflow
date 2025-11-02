import { useQuery } from "@tanstack/react-query";
import { classesService } from "@/services/classesService";
import { QUERY_KEYS } from "@/config";
import type { ClassEntity } from "@/types";

export const useClassesByTeacher = (teacherId: string,status?: boolean) => {
  const query = useQuery<ClassEntity[]>({
    queryKey: [QUERY_KEYS.TEACHER_CLASSES, teacherId],
    queryFn: () => classesService.getByTeacher(teacherId,status),
    enabled: Boolean(teacherId),
  });

  return {
    classes: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
