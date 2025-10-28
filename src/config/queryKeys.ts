export const QUERY_KEYS = {
  SUBMISSIONS: "submissions",
  TEACHER_SUBMISSIONS: "submissions:teacher",
  ARCHIVED_SUBMISSIONS: "submissions:archived",
  CENSORED_SUBMISSIONS: "submissions:censored",
  TEACHER_CENSORED: "censored:teacher",
  TEACHER_ARCHIVED: "archived:teacher"
} as const;

export type QueryKeys = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
