import type { Submission, ClassEntity, User } from "@/types";

export function buildClassLabel(c: { subject: string; grade: string }) {
  return `Grade ${c.grade} - ${c.subject}`;
}


export function mapSubmissionRow(s: any): Submission {
  return {
    id: s.id,
    teacherId: s.teacher_id,
    classId: s.class_id,
    class: {
      id: s.class.id,
      teacherId: s.class.teacher_id,
      subject: s.class.subject,
      grade: s.class.grade,
      active: s.class.active,
      label: buildClassLabel(s.class),
    } as ClassEntity,
    teacher: {
      id: s.teacher.id,
      name: s.teacher.name,
      email: s.teacher.email,
      role: s.teacher.role,
      active: s.teacher.active,
    } as User,
    fileType: s.file_type,
    lessonDate: s.lesson_date,
    copies: s.copies,
    paperColor: s.paper_color,
    notes: s.notes,
    status: s.status,
    printSettings: s.print_settings,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  };
}
