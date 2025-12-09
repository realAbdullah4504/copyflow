import type { WeekDay } from "@/constants";
import type { Submission } from "./submission";

export interface Schedule {
  id: string; // uuid
  classId: string; // reference to classes
  teacherId: string; // reference to profiles
  grade: string; // grade label
  lessonDay: WeekDay[]; // day of the week
  period: number; // period number (0 → period 1)
  viewed: boolean; // viewed or not
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Optional: when fetching schedules with submissions
export interface ScheduleWithSubmissions extends Schedule {
  submissions?: Submission[]; // array of submissions for this schedule
}
