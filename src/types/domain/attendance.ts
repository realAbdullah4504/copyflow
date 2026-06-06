/**
 * Attendance domain types (legacy)
 * Core business entities related to attendance tracking
 */

// Legacy type - kept for backward compatibility
// New attendance types are in student.ts
export interface AttendanceSummary {
  id: string;
  grade: string;
  date: Date;
  present: number;
  absent: number;
  late: number;
  total: number;
}
