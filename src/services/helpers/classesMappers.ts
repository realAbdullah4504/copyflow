import type { ClassesWithSchedules, RawClassData, User } from "@/types";

export function mapClassesData(data: RawClassData): ClassesWithSchedules {
  const schedule = data.schedules[0];
  return {
    id: data.id,
    teacherId: data.teacher_id,
    subject: data.subject,
    grade: data.grade,
    active: data.active,
    lessonDays: schedule ? schedule.lessonDays : [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    label: `Grade ${data.grade} - ${data.subject}`,
    teacher: {
      id: data.teacher.id,
      name: data.teacher.name,
      email: data.teacher.email,
      role: data.teacher.role as User["role"],
      active: data.teacher.active,
      adminId: data.teacher.admin_id || null,
    },
  };
}
