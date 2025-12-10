import type { WeekDay } from "@/constants";
import type { Submission } from "./submission";

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
