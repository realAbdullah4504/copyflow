import { supabase } from "@/integrations/supabase/client";
import type { Student, CreateStudentInput, UpdateStudentInput } from "@/types";
import { AppError } from "@/utils";

export const studentService = {
  async getAll(adminId: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("admin_id", adminId)
      .order("grade", { ascending: true })
      .order("last_name", { ascending: true });

    if (error) throw await AppError.from(error);
    return (data || []).map(mapStudent);
  },

  async getByGrade(adminId: string, grade: string): Promise<Student[]> {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("admin_id", adminId)
      .eq("grade", grade)
      .order("last_name", { ascending: true });

    if (error) throw await AppError.from(error);
    return (data || []).map(mapStudent);
  },

  async create(input: CreateStudentInput): Promise<Student> {
    const { data, error } = await supabase
      .from("students")
      .insert({
        first_name: input.firstName,
        last_name: input.lastName,
        grade: input.grade,
        section: input.section,
        admin_id: input.adminId,
      })
      .select("*")
      .single();

    if (error) throw await AppError.from(error);
    return mapStudent(data);
  },

  async update(id: string, updates: UpdateStudentInput): Promise<Student> {
    const updateData: Record<string, unknown> = {};
    if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
    if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
    if (updates.grade !== undefined) updateData.grade = updates.grade;
    if (updates.section !== undefined) updateData.section = updates.section;
    if (updates.active !== undefined) updateData.active = updates.active;

    const { data, error } = await supabase
      .from("students")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw await AppError.from(error);
    return mapStudent(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (error) throw await AppError.from(error);
  },
};

function mapStudent(row: any): Student {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    grade: row.grade,
    section: row.section || "B",
    adminId: row.admin_id,
    active: row.active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
