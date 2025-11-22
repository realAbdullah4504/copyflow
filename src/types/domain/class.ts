import type { User } from "./user";

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
  "teacherId" | "grade" | "subject"
>;

export type GradeLevel = "9" | "10" | "11" | "12";
