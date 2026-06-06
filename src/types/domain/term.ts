/**
 * Term domain types
 */

export interface Term {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: Date;
}

export interface AbsenceAlertNote {
  id: string;
  studentId: string;
  termId: string;
  notedAt: Date;
  notedBy: string | null;
  lastAbsenceDate: string;
}
