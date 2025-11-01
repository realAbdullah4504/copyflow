/**
 * Submission domain types
 * Core business entities related to print submissions
 */

export type SubmissionStatus = "pending" | "printed" | "censored";

export type FileType =
  | "worksheet"
  | "exam"
  | "handout"
  | "lesson_plan"
  | "other";

export type TimeFrame = "today" | "this_week" | "this_month" | "all";

export type SubmissionFilters = {
  grade?: string;
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
  lessonDate: string;
  subject: string;
  grade: string;
  fileType: FileType;
  files: string[];
  notes: string;
  copies: number;
  paperColor: PaperColor;
  printSettings: {
    doubleSided: boolean;
    stapled: boolean;
    color: boolean;
    booklet: boolean;
    hasCover: boolean;
    coloredCover: boolean;
  };
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}
