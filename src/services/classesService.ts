import { supabase } from "@/lib/supabaseClient";
import type {
  ClassEntity,
  ClassEntityV2,
  ClassScheduleDayKey,
  ClassScheduleLessonDTO,
  CreateClassInput,
  GradeLevel,
  GradeScheduleDTO,
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
      lessonDays: c.lesson_days,
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

  async getAllGradesSchedule(adminId: string): Promise<GradeScheduleDTO[]> {
    const { data: teachers, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "teacher")
      .eq("admin_id", adminId);

    if (!teachers) {
      throw await AppError.from(error);
    }

    const teacherIds = teachers.map((t) => t.id);

    const { data: classes, error: classesError } = await supabase
      .from("classes")
      .select("id, subject, grade, lesson_days, teacher:teacher_id(name)")
      .in("teacher_id", teacherIds)
      .order("created_at", { ascending: false });

    if (classesError) {
      throw await AppError.from(classesError);
    }

    if (!classes) {
      return [];
    }

    const gradeLessonsMap = new Map<
      string,
      Partial<Record<ClassScheduleDayKey, ClassScheduleLessonDTO>>
    >();

    const normalizeDay = (day: string): ClassScheduleDayKey | null => {
      const key = day.toLowerCase() as ClassScheduleDayKey;

      if (
        key === "monday" ||
        key === "tuesday" ||
        key === "wednesday" ||
        key === "thursday"
      ) {
        return key;
      }

      return null;
    };

    for (const cls of classes as Array<{
      id: string;
      subject: string;
      grade: string;
      lesson_days: string[];
      teacher?: { name?: string | null } | null;
    }>) {
      const teacherName = cls.teacher?.name ?? "";
      const gradeKey = cls.grade;

      if (!gradeLessonsMap.has(gradeKey)) {
        gradeLessonsMap.set(gradeKey, {});
      }

      const lessons = gradeLessonsMap.get(gradeKey)!;

      if (Array.isArray(cls.lesson_days)) {
        for (const day of cls.lesson_days) {
          const key = normalizeDay(day);

          if (key && !lessons[key]) {
            lessons[key] = {
              id: cls.id,
              subject: cls.subject,
              teacher: teacherName,
            };
          }
        }
      }
    }

    return Array.from(gradeLessonsMap.entries())
      .sort(([gradeA], [gradeB]) => {
        // Convert to numbers for proper numeric sorting (e.g., "9" < "10")
        const numA = parseInt(gradeA, 10);
        const numB = parseInt(gradeB, 10);
        return isNaN(numA) || isNaN(numB)
          ? gradeA.localeCompare(gradeB) // Fallback to string comparison if not numbers
          : numA - numB; // Numeric comparison
      })
      .map(([gradeLabel, lessons]) => ({
        gradeLabel,
        lessons,
      }));
  },

  async create(data: CreateClassInput): Promise<ClassEntity> {
    const insertData = {
      teacher_id: data.teacherId,
      subject: data.subject,
      grade: data.grade,
      lesson_days: data.lessonDays,
      active: true,
    };

    if (data.lessonDays && data.lessonDays.length > 0) {
      const { data: conflicts, error: conflictError } = await supabase
        .from("classes")
        .select("*")
        .eq("grade", data.grade)
        .overlaps("lesson_days", data.lessonDays);

      if (conflictError) {
        throw await AppError.from(conflictError);
      }

      if (conflicts && conflicts.length > 0) {
        throw new Error(
          "Another teacher is already assigned on one of these days."
        );
      }
    }

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
      ...(updates.lessonDays !== undefined && {
        lesson_days: updates.lessonDays,
      }),
    };

    if (updates.lessonDays && updates.lessonDays.length > 0) {
      const { data: conflicts, error: conflictError } = await supabase
        .from("classes")
        .select("*")
        .eq("grade", updates.grade)
        .overlaps("lesson_days", updates.lessonDays);

      if (conflictError) {
        throw await AppError.from(conflictError);
      }

      if (conflicts && conflicts.length > 0) {
        throw new Error(
          "Another teacher is already assigned on one of these days."
        );
      }
    }

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
