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
  NOTIFICATIONS: "notifications",
} as const;

export type QueryKeys = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
