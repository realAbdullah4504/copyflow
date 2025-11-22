import { QUERY_KEYS } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { classesService } from "@/services";
import type { GradeLevel } from "@/types";

export const useTeachersByGrade = (grade: GradeLevel, adminId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TEACHERS_BY_GRADE, grade, adminId],
    queryFn: () => classesService.getTeachersByGrade(grade, adminId),
    enabled: Boolean(grade && adminId),
  });
};
