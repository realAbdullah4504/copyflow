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

export type FileItem =
  | { existing: true; name: string }
  | { existing: false; file: File };

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
  files?: FileItem[];
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


export type SubmissionRow = {
  id: string;
  teacher_id: string;
  class_id: string;
  class: {
    id: string;
    teacher_id: string;
    subject: string;
    grade: string;
    active: boolean;
  };
  teacher: {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
  };
  file_type: FileType;
  lesson_date: string;
  copies: number;
  paper_color: PaperColor;
  notes?: string | null;
  status: SubmissionStatus;
  print_settings: Submission["printSettings"];
  files?: string[] | null;
  created_at: string;
  updated_at: string;
};