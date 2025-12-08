import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config";
import { classesService, type GradeScheduleDTO } from "@/services/classesService";

export const useAllGradesSchedule = (adminId: string) => {
  return useQuery<GradeScheduleDTO[]>({
    queryKey: [QUERY_KEYS.GRADE_SCHEDULE, "all", adminId],
    queryFn: () => classesService.getAllGradesSchedule(adminId),
    enabled: Boolean(adminId),
  });
};
