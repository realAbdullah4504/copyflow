export const QUERY_KEYS = {
  SUBMISSIONS: "submissions",
  TEACHER_SUBMISSIONS: "submissions:teacher",
  ARCHIVED_SUBMISSIONS: "submissions:archived",
  CENSORED_SUBMISSIONS: "submissions:censored",
  TEACHER_CENSORED: "censored:teacher",
  TEACHER_ARCHIVED: "archived:teacher",
  CLASSES: "classes",
  TEACHER_CLASSES: "classes:teacher",
} as const;

export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
