export const ALLOWED_ACTIONS = {
  "admin": ["view", "edit", "delete"],
  "teacher": ["view", "edit"],
  "secretary": ["view", "delete"],
  "principal": ["view"],
} as const;

export type ActionType = "view" | "edit" | "delete";
