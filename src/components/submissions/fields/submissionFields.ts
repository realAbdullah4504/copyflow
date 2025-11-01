import { z } from 'zod';

export const submissionFormSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string().min(1, 'Grade is required'),
  fileType: z.string().min(1, 'File type is required'),
  files: z.string().min(1, 'At least one file is required'),
  notes: z.string(),
  copies: z.string().min(1, 'Number of copies is required'),
  paperColor: z.string().min(1, 'Paper color is required'),
  doubleSided: z.boolean(),
  stapled: z.boolean(),
  color: z.boolean(),
  teacherId: z.string().min(1, 'Teacher is required'),
  urgency: z.enum(['low', 'medium', 'high']),
});

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>;

export const getSubmissionFields = (options: {
  teachers: Array<{ id: string; name: string }>;
  subjects: string[];
  grades: string[];
  fileTypes: string[];
  paperColors: string[];
}) => [
  {
    name: 'teacherId',
    label: 'Teacher',
    type: 'select' as const,
    options: options.teachers.map((teacher) => ({
      value: teacher.id,
      label: teacher.name,
    })),
    placeholder: 'Select teacher',
  },
  {
    name: 'subject',
    label: 'Subject',
    type: 'select' as const,
    options: options.subjects.map((subject) => ({
      value: subject,
      label: subject,
    })),
    placeholder: 'Select subject',
  },
  {
    name: 'grade',
    label: 'Grade',
    type: 'select' as const,
    options: options.grades.map((grade) => ({
      value: grade,
      label: grade,
    })),
    placeholder: 'Select grade',
  },
  {
    name: 'fileType',
    label: 'File Type',
    type: 'select' as const,
    options: options.fileTypes.map((type) => ({
      value: type.toLowerCase(),
      label: type,
    })),
    placeholder: 'Select file type',
  },
  {
    name: 'files',
    label: 'File Names',
    type: 'text' as const,
    placeholder: 'e.g., worksheet.pdf, answer_key.pdf',
  },
  {
    name: 'copies',
    label: 'Number of Copies',
    type: 'number' as const,
    placeholder: 'Enter number of copies',
  },
  {
    name: 'paperColor',
    label: 'Paper Color',
    type: 'select' as const,
    options: options.paperColors.map((color) => ({
      value: color.toLowerCase(),
      label: color,
    })),
    placeholder: 'Select paper color',
  },
  {
    name: 'urgency',
    label: 'Urgency',
    type: 'select' as const,
    options: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ],
    placeholder: 'Select urgency',
  },
  {
    name: 'notes',
    label: 'Notes (Optional)',
    type: 'textarea' as const,
    placeholder: 'Any special instructions...',
  },
  {
    name: 'doubleSided',
    label: 'Double Sided',
    type: 'checkbox' as const,
  },
  {
    name: 'stapled',
    label: 'Stapled',
    type: 'checkbox' as const,
  },
  {
    name: 'color',
    label: 'Color Print',
    type: 'checkbox' as const,
  },
];

export type SubmissionField = ReturnType<typeof getSubmissionFields>[number];
