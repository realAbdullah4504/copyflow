import { supabase } from "@/integrations/supabase/client";
import { AppError } from "@/utils";
import type { AbsenceAlertNote } from "@/types";

function mapRow(r: any): AbsenceAlertNote {
  return {
    id: r.id,
    studentId: r.student_id,
    termId: r.term_id,
    notedAt: new Date(r.noted_at),
    notedBy: r.noted_by,
    lastAbsenceDate: r.last_absence_date,
  };
}

export const absenceAlertService = {
  async getByTerm(termId: string): Promise<AbsenceAlertNote[]> {
    const { data, error } = await supabase
      .from("absence_alert_notes")
      .select("*")
      .eq("term_id", termId);

    if (error) throw await AppError.from(error);
    return (data || []).map(mapRow);
  },

  async markNoted(params: {
    studentId: string;
    termId: string;
    lastAbsenceDate: string;
    notedBy: string;
  }): Promise<AbsenceAlertNote> {
    const { data, error } = await supabase
      .from("absence_alert_notes")
      .upsert(
        {
          student_id: params.studentId,
          term_id: params.termId,
          last_absence_date: params.lastAbsenceDate,
          noted_by: params.notedBy,
          noted_at: new Date().toISOString(),
        },
        { onConflict: "student_id,term_id" }
      )
      .select("*")
      .single();

    if (error) throw await AppError.from(error);
    return mapRow(data);
  },
};
