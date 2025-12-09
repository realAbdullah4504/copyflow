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
      console.log(schedule)

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

  async create(data: CreateClassInput): Promise<ClassEntity> {
    const insertData = {
      teacher_id: data.teacherId,
      subject: data.subject,
      grade: data.grade,
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
    await supabase.from("schedules").insert({
      teacher_id: data.teacherId,
      grade: data.grade,
      class_id: classData.id,
      lesson_days: data.lessonDays,
    });

    return {
      id: classData.id,
      teacherId: classData.teacher_id,
      subject: classData.subject,
      grade: classData.grade,
      active: classData.active,
      label: `Grade ${classData.grade} - ${classData.subject}`,
      createdAt: new Date(classData.created_at),
      updatedAt: new Date(classData.updated_at),
    };
  },

  async update(
    id: string,
    updates: Partial<Omit<ClassEntity, "id" | "createdAt" | "updatedAt">> & {
      lessonDays?: WeekDay[];
    }
  ): Promise<ClassEntity> {
    // Update basic class info
    const updateData = {
      ...(updates.teacherId !== undefined && { teacher_id: updates.teacherId }),
      ...(updates.subject !== undefined && { subject: updates.subject }),
      ...(updates.grade !== undefined && { grade: updates.grade }),
    };

    // If lessonDays are being updated, handle the schedule updates
    if (updates.lessonDays && updates.lessonDays.length > 0) {
      // Check for schedule conflicts - allow max 4 schedules per day
      const { data: conflicts, error: conflictError } = await supabase
        .from("schedules")
        .select("lesson_day, period, teacher:teacher_id(name)")
        .eq("grade", updates.grade)
        .in("lesson_day", updates.lessonDays)
        .neq("class_id", id); // Exclude current class from conflict check

      if (conflictError) {
        throw await AppError.from(conflictError);
      }

      if (conflicts && conflicts.length > 0) {
        // Group conflicts by day and count periods
        const periodsByDay: Record<string, Set<number>> = {};
        const teachersByDay: Record<string, string[]> = {};

        for (const conflict of conflicts) {
          const day = conflict.lesson_day;
          const period = conflict.period || 1;

          if (!periodsByDay[day]) {
            periodsByDay[day] = new Set();
            teachersByDay[day] = [];
          }

          periodsByDay[day].add(period);
          const teacherName = conflict.teacher?.name ?? "Unknown Teacher";
          teachersByDay[day].push(teacherName);
        }

        // Find days that already have 4 periods
        const fullDays = Object.entries(periodsByDay)
          .filter(([_, periods]) => periods.size >= 4)
          .map(([day]) => day);

        if (fullDays.length > 0) {
          const conflictMessages = fullDays.map((day) => {
            const teachers = [...new Set(teachersByDay[day])]; // Get unique teachers
            return `${
              day.charAt(0).toUpperCase() + day.slice(1)
            }: All 4 periods are taken by ${teachers.length} teacher(s)`;
          });

          throw new Error(
            `Cannot schedule class. Maximum capacity reached for:\n${conflictMessages.join(
              "\n"
            )}`
          );
        }
      }

      // Delete existing schedules for this class
      await supabase.from("schedules").delete().eq("class_id", id);

      // Create new schedule entries
      const scheduleEntries = updates.lessonDays.map((day) => ({
        class_id: id,
        teacher_id: updates.teacherId,
        grade: updates.grade,
        lesson_day: day,
        // You might want to get the period from the existing schedule or as part of updates
        period: 1, // Default or get from input
      }));

      const { error: scheduleError } = await supabase
        .from("schedules")
        .insert(scheduleEntries);

      if (scheduleError) {
        throw await AppError.from(scheduleError);
      }
    }

    // Update the class
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
