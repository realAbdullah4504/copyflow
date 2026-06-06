import { supabase } from "@/integrations/supabase/client";
import type {
  ClassesWithSchedules,
  ClassWithSubmissionsScheduleFiles,
  CreateClassInput,
  GradeLevel,
  LessonSlot,
  PrincipalScheduleDTO,
} from "@/types";
import type { WeekDay } from "@/constants/shared";
import { AppError } from "@/utils";
import { mapClassesData } from "./helpers/classesMappers";
import { scheduleService } from "./scheduleService";

export const classesService = {
  async getAllClassesWithSchedules(
    filterByDay?: WeekDay,
    lessonDate?: string
  ): Promise<ClassWithSubmissionsScheduleFiles[]> {
    // Fetch classes with schedules joined (avoids separate schedules request)
    const { data: classes, error: classesError } = await supabase
      .from("classes")
      .select("*, teacher:teacher_id(*), schedules(*)")
      .order("grade", { ascending: true })
      .order("created_at", { ascending: true });

    if (classesError) throw await AppError.from(classesError);

    // Filter classes by day if needed (using joined schedule data)
    const filteredClasses = filterByDay
      ? (classes || []).filter((cls) => {
          const schedule = cls.schedules?.[0];
          return schedule?.lesson_days?.includes(filterByDay);
        })
      : classes || [];

    let submissions: { class_id: string; files: string }[] = [];
    if (lessonDate) {
      const classIds = filteredClasses.map((c) => c.id);
      if (classIds.length > 0) {
        const { data: subs } = await supabase
          .from("submissions")
          .select("class_id, files,id")
          .in("class_id", classIds)
          .eq("lesson_date", lessonDate)
          .eq("status", "printed");

        submissions = subs || [];
      }
    }

    // Map classes
    return filteredClasses.map((cls) => {
      const schedule = cls.schedules?.[0];
      interface SubmissionWithId {
        id: string;
        class_id: string;
        files: string | string[];
      }

      const classSubmissions = (
        submissions as unknown as SubmissionWithId[]
      ).filter((s) => s.class_id === cls.id);

      const normalizeFiles = (files: string | string[]): string[] => {
        const filesArray = Array.isArray(files) ? files : files ? [files] : [];
        return filesArray.filter(file => !file.includes('submission-details-'));
      };

      return {
        id: cls.id,
        teacherId: cls.teacher_id,
        subject: cls.subject,
        grade: cls.grade,
        active: cls.active,
        teacher: cls.teacher,
        lessonDays: schedule?.lesson_days ?? [],
        submissionFiles: classSubmissions.flatMap((submission) =>
          normalizeFiles(submission.files).map(
            (fileName: string, index: number) => ({
              id: `${submission.id}-${index}`,
              name: fileName,
              submissionId: submission.id,
            })
          )
        ),
        createdAt: new Date(cls.created_at),
        updatedAt: new Date(cls.created_at),
        label: `Grade ${cls.grade} - ${cls.subject}`,
      };
    });
  },

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

    const mapped = classes.map(mapClassesData);

    return mapped;
  },

  async getGradesScheduleByDay(
    day: WeekDay,
    date?: string
  ): Promise<PrincipalScheduleDTO[]> {
    // 1️⃣ Fetch all classes that have the given day and optional date
    const classes: ClassesWithSchedules[] =
      await this.getAllClassesWithSchedules(day, date);

    // 2️⃣ Initialize grades 9–12
    const grouped: Record<GradeLevel, PrincipalScheduleDTO> = [
      "9",
      "10",
      "11",
      "12",
    ].reduce((acc, grade) => {
      acc[grade as GradeLevel] = { grade: grade as GradeLevel, lessons: {} as Record<WeekDay, LessonSlot[]> };
      return acc;
    }, {} as Record<GradeLevel, PrincipalScheduleDTO>);

    // 3️⃣ Build the DTO
    for (const cls of classes) {
      const gradeGroup = grouped[cls.grade as GradeLevel];

      if (cls.lessonDays.includes(day)) {
        if (!gradeGroup.lessons[day]) gradeGroup.lessons[day] = [];

        if (gradeGroup.lessons[day].length < 4) {
          gradeGroup.lessons[day].push({
            teacherName: cls.teacher.name,
            subject: cls.subject,
            classId: cls.id,
            submissionFiles: (cls as any).submissionFiles || [],
          });
        }
      }
    }

    // 4️⃣ Ensure exactly 4 slots per grade/day
    Object.values(grouped).forEach((grade) => {
      if (!grade.lessons[day]) grade.lessons[day] = [];
      while (grade.lessons[day].length < 4) {
        grade.lessons[day].push(null as unknown as LessonSlot);
      }
    });

    return Object.values(grouped);
  },
  async create(data: CreateClassInput): Promise<ClassesWithSchedules> {
    // 1️⃣ Validate schedule availability BEFORE creation
    await scheduleService.validateConflicts(data.grade, data.lessonDays);

    // 2️⃣ Insert the class
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
    if (!classData) {
      throw await AppError.from({
        message: "Failed to create class",
        status: 500,
      });
    }

    await scheduleService.createSchedule({
      teacherId: data.teacherId,
      grade: data.grade,
      classId: classData.id,
      lessonDays: data.lessonDays,
    });

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
    const updateData = {
      ...(updates.teacherId !== undefined && { teacher_id: updates.teacherId }),
      ...(updates.subject !== undefined && { subject: updates.subject }),
      ...(updates.grade !== undefined && { grade: updates.grade }),
    };

    if (updates.lessonDays && updates.lessonDays.length > 0) {
      await scheduleService.validateConflicts(
        updates.grade!,
        updates.lessonDays,
        id
      );

      await scheduleService.updateSchedule(id, {
        teacherId: updates.teacherId!,
        grade: updates.grade!,
        lessonDays: updates.lessonDays,
      });
    }

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
