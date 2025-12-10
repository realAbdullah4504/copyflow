import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config";
import { classesService } from "@/services/classesService";
import type { PrincipalScheduleDTO } from "@/types";
import type { WeekDay } from "@/constants";

export const useAllGradesSchedule = (adminId: string, day: WeekDay,date?:string) => {
  const { data, isLoading, error } = useQuery<PrincipalScheduleDTO[]>({
    queryKey: [QUERY_KEYS.GRADE_SCHEDULE, day, adminId],
    queryFn: () => classesService.getGradesScheduleByDay(day,date),
    enabled: Boolean(adminId),
    placeholderData: (previousData) => previousData ?? [],
  });
  return { data, isLoading, error };
};
