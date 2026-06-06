import { useQuery } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendanceService";
import { QUERY_KEYS } from "@/config";
import type { AttendanceRecord } from "@/types";

export const useAttendance = (grade?: string, lessonDate?: string) => {
  const query = useQuery<AttendanceRecord[]>({
    queryKey: [QUERY_KEYS.ATTENDANCE, grade, lessonDate],
    queryFn: () => attendanceService.getByGradeAndDate(grade!, lessonDate!),
    enabled: Boolean(grade && lessonDate),
  });

  return {
    records: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
