import type { Student, AttendanceStatus, AttendanceRecord, AbsenceAlertNote } from "@/types";

/** School operates Mon–Thu only. Returns true for Mon(1)–Thu(4). */
export function isSchoolDay(dateStr: string): boolean {
  // Parse as local date (not UTC) by splitting the date string
  const [year, month, dayOfMonth] = dateStr.split("-").map(Number);
  const day = new Date(year, month - 1, dayOfMonth).getDay();
  return day >= 1 && day <= 4;
}

/** Compute academic year string from a date */
export function computeAcademicYear(dateStr: string): string {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  if (month >= 9) return `${year}-${String(year + 1).slice(-2)}`;
  return `${year - 1}-${String(year).slice(-2)}`;
}

/** Status config with labels and colors */
export const STATUSES: { value: AttendanceStatus; label: string; color: string }[] = [
  { value: "present", label: "Present", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { value: "absent", label: "Absent", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { value: "late", label: "Late", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { value: "excused", label: "Permission", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
];

export interface StudentCounters {
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  consecutiveAbsences: number;
  lastAbsenceDate: string | null;
}

/**
 * Compute per-student counters from term attendance records.
 * Consecutive absences only count Mon–Thu school days.
 */
export function computeStudentCounters(
  studentId: string,
  termRecords: AttendanceRecord[]
): StudentCounters {
  const studentRecords = termRecords
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => a.lessonDate.localeCompare(b.lessonDate));

  let totalAbsent = 0;
  let totalLate = 0;
  let totalExcused = 0;

  for (const r of studentRecords) {
    if (r.status === "absent") totalAbsent++;
    else if (r.status === "late") totalLate++;
    else if (r.status === "excused") totalExcused++;
  }

  // Compute consecutive absences counting backwards from most recent records
  // Only consider school days (Mon–Thu)
  const schoolDayRecords = studentRecords
    .filter((r) => isSchoolDay(r.lessonDate))
    .sort((a, b) => b.lessonDate.localeCompare(a.lessonDate)); // newest first

  let consecutiveAbsences = 0;
  let lastAbsenceDate: string | null = null;

  for (const r of schoolDayRecords) {
    if (r.status === "absent") {
      consecutiveAbsences++;
      if (!lastAbsenceDate) lastAbsenceDate = r.lessonDate;
    } else {
      break; // streak broken
    }
  }

  return { totalAbsent, totalLate, totalExcused, consecutiveAbsences, lastAbsenceDate };
}

/**
 * Determine which students have 3+ consecutive absences and haven't been noted.
 */
export function getActiveAlerts(
  students: Student[],
  termRecords: AttendanceRecord[],
  alertNotes: AbsenceAlertNote[]
): { student: Student; consecutiveAbsences: number; lastAbsenceDate: string }[] {
  const alerts: { student: Student; consecutiveAbsences: number; lastAbsenceDate: string }[] = [];

  for (const student of students) {
    const counters = computeStudentCounters(student.id, termRecords);
    if (counters.consecutiveAbsences >= 3 && counters.lastAbsenceDate) {
      // Check if already noted for this streak
      const note = alertNotes.find((n) => n.studentId === student.id);
      if (!note || note.lastAbsenceDate < counters.lastAbsenceDate) {
        alerts.push({
          student,
          consecutiveAbsences: counters.consecutiveAbsences,
          lastAbsenceDate: counters.lastAbsenceDate,
        });
      }
    }
  }

  return alerts;
}
