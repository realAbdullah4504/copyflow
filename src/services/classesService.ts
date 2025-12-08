import { supabase } from "@/lib/supabaseClient";
import type {
  ClassEntity,
  ClassEntityV2,
  CreateClassInput,
  GradeLevel,
  User,
} from "@/types";
import { AppError } from "@/utils";
import { mapClassesData } from "./helpers/classesMappers";

export const classesService = {
  async getByTeacher(
    teacherId: string,
    status?: boolean
  ): Promise<ClassEntity[]> {
    let query = supabase
      .from("classes")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    if (typeof status === "boolean") {
      query = query.eq("active", status);
    }

    const { data: classes, error } = await query;

    if (error) {
      throw await AppError.from(error);
    }

    if (!classes) {
      throw await AppError.from({
        message: "Classes not found",
        status: 404,
      });
    }

    return classes.map((c) => ({
      id: c.id,
      teacherId: c.teacher_id,
      subject: c.subject,
      grade: c.grade,
      active: c.active,
      createdAt: new Date(c.created_at),
      updatedAt: new Date(c.updated_at),
      label: `Grade ${c.grade} - ${c.subject}`,
    }));
  },

  async getTeachersByGrade(
    grade: GradeLevel,
    adminId: string
  ): Promise<ClassEntityV2[]> {
    const { data: teachers, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "teacher")
      .eq("admin_id", adminId);

    if (!teachers) {
      throw await AppError.from(error);
    }

    const teacherIds = teachers.map((t) => t.id);

    const { data: classes } = await supabase
      .from("classes")
      .select("*, teacher:teacher_id(id, name, email, role,admin_id,active)")
      .eq("grade", grade)
      .in("teacher_id", teacherIds)
      .order("created_at", { ascending: false });

    if (!classes) {
      throw await AppError.from(error);
    }

    const mapped = classes.map(mapClassesData);

    return mapped;
  },

  async create(data: CreateClassInput): Promise<ClassEntity> {
    const insertData = {
      teacher_id: data.teacherId,
      subject: data.subject,
      grade: data.grade,
      lesson_days: data.lessonDays,
      active: true,
    };

    const { data: classData, error } = await supabase
      .from("classes")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw await AppError.from(error);
    }

    if (!classData) {
      throw await AppError.from({
        message: "Failed to create class",
        status: 500,
      });
    }

    return {
      id: classData.id,
      teacherId: classData.teacher_id,
      subject: classData.subject,
      grade: classData.grade,
      active: classData.active,
      lessonDays: classData.lesson_days,
      label: `Grade ${classData.grade} - ${classData.subject}`,
      createdAt: new Date(classData.created_at),
      updatedAt: new Date(classData.updated_at),
    };
  },

  async update(
    id: string,
    updates: Partial<ClassEntity>
  ): Promise<ClassEntity> {
    const updateData = {
      ...(updates.teacherId !== undefined && { teacher_id: updates.teacherId }),
      ...(updates.subject !== undefined && { subject: updates.subject }),
      ...(updates.grade !== undefined && { grade: updates.grade }),
    };

    const { data: classData, error } = await supabase
      .from("classes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw await AppError.from(error);
    }

    if (!classData) {
      throw await AppError.from({
        message: "Class not found",
        status: 404,
      });
    }

    return {
      id: classData.id,
      teacherId: classData.teacher_id,
      subject: classData.subject,
      grade: classData.grade,
      lessonDays: classData.lesson_days,
      active: classData.active,
      label: `Grade ${classData.grade} - ${classData.subject}`,
      createdAt: new Date(classData.created_at),
      updatedAt: new Date(classData.updated_at),
    };
  },

  async toggleActive(id: string): Promise<ClassEntity> {
    const { data: currentClass, error: fetchError } = await supabase
      .from("classes")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw await AppError.from(fetchError);
    }

    if (!currentClass) {
      throw await AppError.from({
        message: "Class not found",
        status: 404,
      });
    }

    const { data: updatedClass, error: updateError } = await supabase
      .from("classes")
      .update({
        active: !currentClass.active,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      throw await AppError.from(updateError);
    }

    if (!updatedClass) {
      throw await AppError.from({
        message: "Failed to update class status",
        status: 500,
      });
    }

    return {
      id: updatedClass.id,
      teacherId: updatedClass.teacher_id,
      subject: updatedClass.subject,
      grade: updatedClass.grade,
      active: updatedClass.active,
      lessonDays: updatedClass.lesson_days,
      label: `Grade ${updatedClass.grade} - ${updatedClass.subject}`,
      createdAt: new Date(updatedClass.created_at),
      updatedAt: new Date(updatedClass.updated_at),
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("classes").delete().eq("id", id);

    if (error) {
      throw await AppError.from(error);
    }
  },
};
