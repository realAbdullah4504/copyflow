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

  async getAllGradesSchedule(adminId: string): Promise<GradeScheduleDTO[]> {
    // 1️⃣ Fetch teachers
    const { data: teachers, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "teacher")
      .eq("admin_id", adminId);

    if (!teachers) {
      throw await AppError.from(error);
    }

    const teacherIds = teachers.map((t) => t.id);

    // 2️⃣ Fetch classes with all submissions
    const { data: classes, error: classesError } = await supabase
      .from("classes")
      .select(
        `
      id,
      subject,
      grade,
      lesson_days,
      teacher:teacher_id(name),
      submissions(id, lesson_date, files)
    `
      )
      .in("teacher_id", teacherIds)
      .order("created_at", { ascending: false });

    if (classesError) {
      throw await AppError.from(classesError);
    }

    if (!classes) return [];

    // 3️⃣ Prepare week start (Monday) for calculating exact lesson dates
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

    const weekDayIndexMap: Record<WeekDay, number> = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
    };

    const getLessonDate = (day: WeekDay) =>
      addDays(weekStart, weekDayIndexMap[day]);

    // 4️⃣ Helper to normalize lesson days
    const normalizeDay = (day: string): WeekDay | null => {
      const key = day.toLowerCase() as WeekDay;
      if (["monday", "tuesday", "wednesday", "thursday"].includes(key))
        return key;
      return null;
    };

    // 5️⃣ Map grades to lessons
    const gradeLessonsMap = new Map<
      string,
      Partial<Record<WeekDay, ClassScheduleLessonDTO>>
    >();

    for (const cls of classes as Array<{
      id: string;
      subject: string;
      grade: string;
      lesson_days: string[];
      teacher?: { name?: string | null } | null;
      submissions?: Array<{ id: string; lesson_date: string; files?: any }>;
    }>) {
      const teacherName = cls.teacher?.name ?? "";
      const gradeKey = cls.grade;

      if (!gradeLessonsMap.has(gradeKey)) gradeLessonsMap.set(gradeKey, {});
      const lessons = gradeLessonsMap.get(gradeKey)!;

      if (Array.isArray(cls.lesson_days)) {
        for (const day of cls.lesson_days) {
          const key = normalizeDay(day);
          if (!key) continue;

          if (!lessons[key]) {
            const lessonDate = getLessonDate(key); // exact date for this lesson day

            const submissionsThisLesson = (cls.submissions ?? []).filter(
              (sub) => {
                const subDate = new Date(sub.lesson_date);
                return (
                  subDate.getFullYear() === lessonDate.getFullYear() &&
                  subDate.getMonth() === lessonDate.getMonth() &&
                  subDate.getDate() === lessonDate.getDate()
                );
              }
            );

            lessons[key] = {
              id: cls.id,
              subject: cls.subject,
              teacher: teacherName,
              submissions: submissionsThisLesson, // only for this lesson date
            };
          }
        }
      }
    }

    // 6️⃣ Convert Map to sorted array
    return Array.from(gradeLessonsMap.entries())
      .sort(([gradeA], [gradeB]) => {
        const numA = parseInt(gradeA, 10);
        const numB = parseInt(gradeB, 10);
        return isNaN(numA) || isNaN(numB)
          ? gradeA.localeCompare(gradeB)
          : numA - numB;
      })
      .map(([gradeLabel, lessons]) => ({
        gradeLabel,
        lessons,
      }));
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
    updates: Partial<Omit<ClassesWithSchedules, "id" | "createdAt" | "updatedAt">> & {
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
        period: 1, // default period
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
