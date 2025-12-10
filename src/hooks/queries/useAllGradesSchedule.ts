import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config";
import { classesService } from "@/services/classesService";
import type { PrincipalScheduleDTO } from "@/types";

export const useAllGradesSchedule = (adminId: string) => {
  return useQuery<PrincipalScheduleDTO[]>({
    queryKey: [QUERY_KEYS.GRADE_SCHEDULE, "all", adminId],
    queryFn: () => classesService.getAllGradesWithSchedule(),
    enabled: Boolean(adminId),
  });
};
