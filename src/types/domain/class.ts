import type { Schedule } from "./schedule";
import type { User } from "./user";
import type { WeekDay } from "@/constants/shared";

export interface ClassEntity {
  id: string;
  label: string;
  teacherId: string;
  grade: string;
  subject: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RawClassData = {
  id: string;
  teacher_id: string;
  subject: string;
  grade: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  schedules: Schedule[];
  teacher: {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
    admin_id: string | null;
  };
};

export type ClassEntityV2 = ClassEntity & { teacher: User };
export type ClassesWithSchedules = ClassEntityV2 & {
  lessonDays: WeekDay[];
};

export interface SubmissionFile {
  id: string;
  name: string;
  submissionId: string;
}

export type ClassWithSubmissionsScheduleFiles = ClassesWithSchedules & {
  submissionFiles: SubmissionFile[];
};

export type CreateClassInput = Pick<
  ClassEntity,
  "teacherId" | "grade" | "subject"
> & {
  lessonDays: WeekDay[];
};

export type GradeLevel = "9" | "10" | "11" | "12";
