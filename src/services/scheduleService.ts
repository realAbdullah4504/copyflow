import type { WeekDay } from "@/constants";
import { supabase } from "@/integrations/supabase/client";
import type { Schedule } from "@/types";
import { AppError } from "@/utils";

export const scheduleService = {
  async getSchedulesForClasses(
    classIds: string[]
  ): Promise<Record<string, Schedule>> {
    const { data, error } = await supabase
      .from("schedules")
      .select("*")
      .in("class_id", classIds);

    if (error) throw await AppError.from(error);

    // Map schedules by classId for easy lookup
    return data.reduce((acc, schedule) => {
      acc[schedule.class_id] = schedule;
      return acc;
    }, {} as Record<string, Schedule>);
  },
  async validateConflicts(
    grade: string,
    lessonDays: WeekDay[],
    classId?: string // optional: used to exclude current class during update
  ) {
    for (const day of lessonDays) {
      let query = supabase
        .from("schedules")
        .select("id")
        .eq("grade", grade)
        .contains("lesson_days", [day]);

      // Exclude current class if updating
      if (classId) {
        query = query.neq("class_id", classId);
      }

      const { data, error } = await query;

      if (error) throw await AppError.from(error);

      if (data && data.length >= 4) {
        throw new Error(
          `Cannot assign lesson on ${day}. Maximum 4 teachers already scheduled for grade ${grade}.`
        );
      }
    }
  },

  async createSchedule(entry: {
    teacherId: string;
    grade: string;
    classId: string;
    lessonDays: WeekDay[];
  }) {
    const payload = {
      teacher_id: entry.teacherId,
      grade: entry.grade,
      class_id: entry.classId,
      lesson_days: entry.lessonDays,
    };

    const { error } = await supabase.from("schedules").insert([payload]);

    if (error) throw await AppError.from(error);
  },

  async updateSchedule(classId: string, updates: Partial<Schedule>) {
    const updateData = {
      ...(updates.teacherId !== undefined && { teacher_id: updates.teacherId }),
      ...(updates.lessonDays !== undefined && {
        lesson_days: updates.lessonDays,
      }),
      ...(updates.grade !== undefined && { grade: updates.grade }),
    };
    const { data: updatedSchedule, error } = await supabase
      .from("schedules")
      .update(updateData)
      .eq("class_id", classId)
      .select()
      .single();

    if (error) throw await AppError.from(error);

    return updatedSchedule;
  },
};
