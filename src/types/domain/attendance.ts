/**
 * Attendance domain types
 * Core business entities related to attendance tracking
 */

export interface AttendanceRecord {
  id: string;
  grade: string;
  date: Date;
  present: number;
  absent: number;
  late: number;
  total: number;
}
