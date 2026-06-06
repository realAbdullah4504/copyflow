import { supabase } from "@/integrations/supabase/client";
import { AppError } from "@/utils";
import type { AttendanceRecord, AttendanceStatus } from "@/types";

export interface AttendanceRow {
  id: string;
  student_id: string;
  class_id: string | null;
  lesson_date: string;
  status: AttendanceStatus;
  academic_year: string;
  created_at: string;
  updated_at: string;
}

function mapRow(row: AttendanceRow): AttendanceRecord {
  return {
    id: row.id,
    studentId: row.student_id,
    classId: row.class_id ?? "",
    lessonDate: row.lesson_date,
    status: row.status,
    academicYear: row.academic_year,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export const attendanceService = {
  /** Fetch attendance records for a grade on a specific date */
  async getByGradeAndDate(grade: string, lessonDate: string): Promise<AttendanceRecord[]> {
    // Get student IDs for this grade
    const { data: students, error: studErr } = await supabase
      .from("students")
      .select("id")
      .eq("grade", grade)
      .eq("active", true);

    if (studErr) throw await AppError.from(studErr);
    if (!students?.length) return [];

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .in("student_id", students.map((s) => s.id))
      .eq("lesson_date", lessonDate)
      .order("created_at", { ascending: true });

    if (error) throw await AppError.from(error);
    return (data || []).map(mapRow);
  },

  /** Upsert attendance for multiple students at once (grade-based, no class_id) */
  async upsertBatch(
    records: {
      studentId: string;
      lessonDate: string;
      status: AttendanceStatus;
      academicYear: string;
    }[]
  ): Promise<AttendanceRecord[]> {
    const rows = records.map((r) => ({
      student_id: r.studentId,
      lesson_date: r.lessonDate,
      status: r.status,
      academic_year: r.academicYear,
    }));

    const { data, error } = await supabase
      .from("attendance")
      .upsert(rows, {
        onConflict: "student_id,lesson_date",
      })
      .select("*");

    if (error) throw await AppError.from(error);
    return (data || []).map(mapRow);
  },
};
