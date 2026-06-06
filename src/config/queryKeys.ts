export const QUERY_KEYS = {
  CURRENT_USER: "currentUser",
  TEACHERS: "teachers",
  USERS: "users",
  USER: "user",
  SUBMISSIONS: "submissions",
  TEACHER_SUBMISSIONS: "submissions:teacher",
  ARCHIVED_SUBMISSIONS: "submissions:archived",
  CENSORED_SUBMISSIONS: "submissions:censored",
  TEACHER_CENSORED: "censored:teacher",
  TEACHER_ARCHIVED: "archived:teacher",
  CLASSES: "classes",
  TEACHER_CLASSES: "classes:teacher",
  TEACHERS_BY_GRADE: "teachers:grade",
  GRADE_SCHEDULE: "schedule:grade",
  NOTIFICATIONS: "notifications",
  STUDENTS: "students",
  ATTENDANCE: "attendance",
  TERMS: "terms",
  ABSENCE_ALERTS: "absence_alerts",
} as const;

export type QueryKeys = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
