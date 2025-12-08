import type { Submission } from "./submission";
import type { User } from "./user";
import type { WeekDay } from "@/constants/shared";

export interface ClassEntity {
  id: string;
  label: string;
  teacherId: string;
  grade: string;
  subject: string;
  lessonDays: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RawClassData = {
  id: string;
  teacher_id: string;
  subject: string;
  grade: string;
  lesson_days: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
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

export type CreateClassInput = Pick<
  ClassEntity,
  "teacherId" | "grade" | "subject" | "lessonDays"
>;

export type GradeLevel = "9" | "10" | "11" | "12";

export interface ClassScheduleLessonDTO {
  id: string;
  subject: string;
  teacher: string;
  submissions?: Partial<Submission>[];
}

export interface GradeScheduleDTO {
  gradeLabel: string;
  lessons: Partial<Record<WeekDay, ClassScheduleLessonDTO>>;
}
