/**
 * Student domain types
 */

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  section: string;
  adminId: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateStudentInput = Pick<Student, "firstName" | "lastName" | "grade" | "section" | "adminId">;
export type UpdateStudentInput = Partial<Pick<Student, "firstName" | "lastName" | "grade" | "section" | "active">>;

export type ConductGrade = "S+" | "S" | "S*" | "S-";
export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface StudentEnrollment {
  id: string;
  studentId: string;
  classId: string;
  academicYear: string;
  active: boolean;
  createdAt: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  lessonDate: string;
  status: AttendanceStatus;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentMark {
  id: string;
  studentId: string;
  classId: string;
  mark: number | null;
  conduct: ConductGrade | null;
  academicYear: string;
  term: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
