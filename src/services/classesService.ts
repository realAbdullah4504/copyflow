import { supabase } from "@/lib/supabaseClient";
import type {
  ClassEntity,
  ClassesWithSchedules,
  CreateClassInput,
  GradeLevel,
} from "@/types";
import type { WeekDay } from "@/constants/shared";
import { AppError } from "@/utils";
import { mapClassesData } from "./helpers/classesMappers";
import { addDays, startOfWeek } from "date-fns";

export const classesService = {
  async getByTeacher(
    teacherId: string,
    status?: boolean
  ): Promise<ClassesWithSchedules[]> {
    let query = supabase
      .from("classes")
      .select("*, schedules(*),teacher:teacher_id(*)")
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    if (typeof status === "boolean") {
      query = query.eq("active", status);
    }

    const { data: classes, error } = await query;

    if (error) {
      throw await AppError.from(error);
    }

    if (!classes || classes.length === 0) {
      throw await AppError.from({
        message: "Classes not found",
        status: 404,
      });
    }

    return classes.map((c) => {
      const schedule = c.schedules?.[0] || null;

      return {
        id: c.id,
        teacherId: c.teacher_id,
        subject: c.subject,
        grade: c.grade,
        active: c.active,
        teacher: c.teacher,
        lessonDays: schedule ? schedule.lesson_days : [], // always returns array
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at),
        label: `Grade ${c.grade} - ${c.subject}`,
      };
    });
  },

  async getTeachersByGrade(
    grade: GradeLevel,
    adminId: string
  ): Promise<ClassesWithSchedules[]> {
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
      .select(
        "*, teacher:teacher_id(id, name, email, role,admin_id,active),schedules(*)"
      )
      .eq("grade", grade)
      .in("teacher_id", teacherIds)
      .order("created_at", { ascending: false });

    if (!classes) {
      throw await AppError.from(error);
    }

    console.log("classes", classes);

    const mapped = classes.map(mapClassesData);

    return mapped;
  },

  async create(data: CreateClassInput): Promise<ClassesWithSchedules> {
    // Check for conflicts: max 4 teachers per day per grade
    for (const day of data.lessonDays) {
      const { data: existingSchedules, error: conflictError } = await supabase
        .from("schedules")
        .select("id, teacher_id")
        .eq("grade", data.grade)
        .contains("lesson_days", [day]);

      if (conflictError) throw await AppError.from(conflictError);

      if (existingSchedules && existingSchedules.length >= 4) {
        throw new Error(
          `Cannot assign lesson on ${day}. Maximum 4 teachers already scheduled for grade ${data.grade}.`
        );
      }
    }

    // Insert the class
    const insertData = {
      teacher_id: data.teacherId,
      subject: data.subject,
      grade: data.grade,
      active: true,
    };

    const { data: classData, error } = await supabase
      .from("classes")
      .insert(insertData)
      .select("*, teacher:teacher_id(*)")
      .single();

    if (error) throw await AppError.from(error);
    if (!classData)
      throw await AppError.from({
        message: "Failed to create class",
        status: 500,
      });

    // Insert the schedule
    const scheduleEntry = {
      teacher_id: data.teacherId,
      grade: data.grade,
      class_id: classData.id,
      lesson_days: data.lessonDays, // array of WeekDay
      period: 1, // default period
    };

    const { error: scheduleError } = await supabase
      .from("schedules")
      .insert([scheduleEntry]);

    if (scheduleError) throw await AppError.from(scheduleError);

    return {
      id: classData.id,
      teacherId: classData.teacher_id,
      subject: classData.subject,
      grade: classData.grade,
      active: classData.active,
      teacher: classData.teacher,
      lessonDays: data.lessonDays,
      createdAt: new Date(classData.created_at),
      updatedAt: new Date(classData.updated_at),
      label: `Grade ${classData.grade} - ${classData.subject}`,
    };
  },

  async update(
    id: string,
    updates: Partial<
      Omit<ClassesWithSchedules, "id" | "createdAt" | "updatedAt">
    > & {
      lessonDays?: WeekDay[];
    }
  ): Promise<ClassesWithSchedules> {
    // Update class info
    const updateData = {
      ...(updates.teacherId !== undefined && { teacher_id: updates.teacherId }),
      ...(updates.subject !== undefined && { subject: updates.subject }),
      ...(updates.grade !== undefined && { grade: updates.grade }),
    };

    // Handle schedule update if lessonDays are provided
    if (updates.lessonDays && updates.lessonDays.length > 0) {
      // Check for conflicts: max 4 per day per grade
      for (const day of updates.lessonDays) {
        const { data: existingSchedules, error: conflictError } = await supabase
          .from("schedules")
          .select("id, teacher_id")
          .eq("grade", updates.grade)
          .contains("lesson_days", [day])
          .neq("class_id", id); // exclude current class

        if (conflictError) throw await AppError.from(conflictError);

        if (existingSchedules && existingSchedules.length >= 4) {
          throw new Error(
            `Cannot assign lesson on ${day}. Maximum 4 teachers already scheduled for grade ${updates.grade}.`
          );
        }
      }

      // Delete existing schedules for this class
      await supabase.from("schedules").delete().eq("class_id", id);

      // Insert new schedule
      const scheduleEntry = {
        class_id: id,
        teacher_id: updates.teacherId!,
        grade: updates.grade!,
        lesson_days: updates.lessonDays, // array of WeekDay
      };

      const { error: scheduleError } = await supabase
        .from("schedules")
        .insert([scheduleEntry]);

      if (scheduleError) throw await AppError.from(scheduleError);
    }

    // Update the class itself
    const { data: classData, error } = await supabase
      .from("classes")
      .update(updateData)
      .eq("id", id)
      .select("*, schedules(*), teacher:teacher_id(*)")
      .single();

    if (error) throw await AppError.from(error);
    if (!classData)
      throw await AppError.from({ message: "Class not found", status: 404 });

    const schedule = classData.schedules?.[0];

    return {
      id: classData.id,
      teacherId: classData.teacher_id,
      subject: classData.subject,
      grade: classData.grade,
      active: classData.active,
      teacher: classData.teacher,
      lessonDays: schedule?.lesson_days ?? [],
      createdAt: new Date(classData.created_at),
      updatedAt: new Date(classData.updated_at),
      label: `Grade ${classData.grade} - ${classData.subject}`,
    };
  },

  async toggleActive(id: string): Promise<ClassesWithSchedules> {
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
      .select("*, schedules(*), teacher:teacher_id(*)") // Added teacher info
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

    const schedule = updatedClass.schedules?.[0];

    return {
      id: updatedClass.id,
      teacherId: updatedClass.teacher_id,
      subject: updatedClass.subject,
      grade: updatedClass.grade,
      active: updatedClass.active,
      teacher: updatedClass.teacher,
      lessonDays: schedule?.lesson_days ?? [],
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
