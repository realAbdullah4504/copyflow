/**
 * Submission domain types
 * Core business entities related to print submissions
 */

import type { ClassEntity } from "./class";
import type { User } from "./user";

export type SubmissionStatus = "pending" | "printed" | "censored";

export type FileType =
  | "worksheet"
  | "exam"
  | "handout"
  | "lesson_plan"
  | "other";

export type TimeFrame = "today" | "7d" | "30d" | "this_month" | "all";

export type SubmissionFilters = {
  class?: string;
  fileType?: FileType;
  status?: SubmissionStatus;
  timeFrame?: TimeFrame;
};

export type SortDirection = "asc" | "desc";

export type SubmissionSort = {
  id: string;
  desc: boolean;
};

export type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type SubmissionQueryParams = {
  pagination?: PaginationState;
  filters?: SubmissionFilters;
  sorting?: SubmissionSort[];
};

export type PaperColor = "white" | "yellow" | "blue" | "green" | "pink";

export interface Submission {
  id: string;
  teacherId: string;
  classId: string;
  class?: ClassEntity;
  teacher?: User;
  fileType: FileType;
  lessonDate: Date;
  copies: number;
  paperColor: PaperColor;
  notes?: string;
  status: SubmissionStatus;
  printSettings: {
    doubleSided: boolean;
    stapled: boolean;
    color: boolean;
    booklet: boolean;
    hasCover: boolean;
    coloredCover: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type CreateSubmissionInput = Pick<
  Submission,
  | "teacherId"
  | "classId"
  | "fileType"
  | "lessonDate"
  | "copies"
  | "paperColor"
  | "notes"
  | "printSettings"
>;
