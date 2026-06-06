import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUERY_KEYS } from "@/config";
import type { AttendanceRecord } from "@/types";

/**
 * Fetch all attendance records for a grade within a date range (term).
 * Used for computing counters and consecutive absence streaks.
 */
export const useTermAttendance = (
  grade: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined
) => {
  const query = useQuery<AttendanceRecord[]>({
    queryKey: [QUERY_KEYS.ATTENDANCE, "term", grade, startDate, endDate],
    queryFn: async () => {
      // Fetch students for this grade first, then attendance
      const { data: students, error: studErr } = await supabase
        .from("students")
        .select("id")
        .eq("grade", grade!)
        .eq("active", true);

      if (studErr) throw studErr;
      if (!students?.length) return [];

      const studentIds = students.map((s) => s.id);

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .in("student_id", studentIds)
        .gte("lesson_date", startDate!)
        .lte("lesson_date", endDate!)
        .order("lesson_date", { ascending: true });

      if (error) throw error;
      return (data || []).map((row: any) => ({
        id: row.id,
        studentId: row.student_id,
        classId: row.class_id ?? "",
        lessonDate: row.lesson_date,
        status: row.status,
        academicYear: row.academic_year,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));
    },
    enabled: Boolean(grade && startDate && endDate),
  });

  return {
    records: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
