/**
 * Submission domain types
 * Core business entities related to print submissions
 */

export type SubmissionStatus = 'pending' | 'printed' | 'censored' | 'flagged';

export type FileType = 'worksheet' | 'exam' | 'handout' | 'lesson_plan' | 'other';

export type PaperColor = 'white' | 'yellow' | 'blue' | 'green' | 'pink';

export interface Submission {
  id: string;
  teacherId: string;
  teacherName: string;
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
  };
  status: SubmissionStatus;
  urgency: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}
