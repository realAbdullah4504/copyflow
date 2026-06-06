import { supabase } from "@/integrations/supabase/client";
import { AppError } from "@/utils";
import type { Term } from "@/types";

export const termsService = {
  async getAll(): Promise<Term[]> {
    const { data, error } = await supabase
      .from("terms")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) throw await AppError.from(error);
    return (data || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      academicYear: r.academic_year,
      startDate: r.start_date,
      endDate: r.end_date,
      isActive: r.is_active,
      createdAt: new Date(r.created_at),
    }));
  },

  async getActive(): Promise<Term | null> {
    const { data, error } = await supabase
      .from("terms")
      .select("*")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error) throw await AppError.from(error);
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      academicYear: data.academic_year,
      startDate: data.start_date,
      endDate: data.end_date,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
    };
  },
};
