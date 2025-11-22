import type {
  Submission,
  ClassEntity,
  User,
  SubmissionRow,
  FileItem,
} from "@/types";

function isSubmissionUrgent(lessonDate: string): boolean {
  const today = new Date();
  const submissionDate = new Date(lessonDate);

  // Reset times to midnight for comparison
  today.setHours(0, 0, 0, 0);
  submissionDate.setHours(0, 0, 0, 0);

  const diffDays =
    (submissionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  // Check if it's today (0) or tomorrow (1)
  return diffDays >= 0 && diffDays <= 1;
}

export function buildClassLabel(c: { subject: string; grade: string }) {
  return `Grade ${c.grade} - ${c.subject}`;
}

export function mapSubmissionRow(s: unknown): Submission {
  const row = s as SubmissionRow;
  const files: FileItem[] =
    row?.files?.map((file: string) => ({
      existing: true as const,
      name: file,
    })) || [];

  return {
    id: row.id,
    teacherId: row.teacher_id,
    classId: row.class_id,
    class: {
      id: row.class.id,
      teacherId: row.class.teacher_id,
      subject: row.class.subject,
      grade: row.class.grade,
      active: row.class.active,
      label: buildClassLabel(row.class),
    } as ClassEntity,
    teacher: {
      id: row.teacher.id,
      name: row.teacher.name,
      email: row.teacher.email,
      role: row.teacher.role,
      active: row.teacher.active,
    } as User,
    fileType: row.file_type,
    lessonDate: row.lesson_date,
    copies: row.copies,
    paperColor: row.paper_color,
    notes: row.notes ?? undefined,
    status: row.status,
    printSettings: row.print_settings,
    files,
    isUrgent: isSubmissionUrgent(row.lesson_date),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
