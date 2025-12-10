import type { WeekDay } from "@/constants";
import type { Submission } from "./submission";
import type { GradeLevel } from "./class";

export interface Schedule {
  id: string;
  classId: string;
  teacherId: string;
  grade: string;
  lessonDays: WeekDay[];
  period: number;
  viewed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Optional: when fetching schedules with submissions
export interface ScheduleWithSubmissions extends Schedule {
  submissions?: Submission[]; // array of submissions for this schedule
}


export type PrincipalScheduleDTO = {
  grade: GradeLevel; // "9" | "10" | "11" | "12"
  lessons: Record<WeekDay, LessonSlot[]>; // key = weekday, value = array of 4 slots
};

export type LessonSlot = {
  teacherName: string;
  subject: string;
  classId: string;
  submissionFiles: string[];
};
