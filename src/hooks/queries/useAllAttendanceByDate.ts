import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QUERY_KEYS } from "@/config";
import type { AttendanceRecord } from "@/types";

/**
 * Fetch ALL attendance records for a specific date (across all grades).
 * RLS handles access control.
 */
export const useAllAttendanceByDate = (lessonDate: string | undefined) => {
  const query = useQuery<AttendanceRecord[]>({
    queryKey: [QUERY_KEYS.ATTENDANCE, "all", lessonDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("lesson_date", lessonDate!)
        .order("created_at", { ascending: true });

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
    enabled: Boolean(lessonDate),
  });

  return {
    records: query.data || [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
