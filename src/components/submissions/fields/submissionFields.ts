import { z } from "zod";

export const submissionFormSchema = z.object({
  teacherId: z.string().min(1, "Teacher is required"),
  class: z.string().min(1, "Class is required"),
  fileType: z.string().min(1, "File type is required"),
  lessonDate: z.string().min(1, "Lesson date is required"),
  copies: z.number().min(1, "At least one copy is required"),
  paperColor: z.string().min(1, "Paper color is required"),
  printSettings: z.object({
    doubleSided: z.boolean(),
    stapled: z.boolean(),
    booklet: z.boolean(),
    hasCover: z.boolean(),
    coloredCover: z.boolean(),
    color: z.boolean(),
  }),
  files: z.array(z.instanceof(File)).min(1, "At least one file is required"),
  notes: z.string().optional(),
});

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>;

export const getSubmissionFields = (options: {
  classes: string[];
  fileTypes: string[];
  paperColors: string[];
  teachers: { id: string; name: string }[];
  disabledFields?: string[];
}) => [
  {
    name: "teacherId",
    label: "Teacher",
    type: "select" as const,
    options: options.teachers.map((teacher) => ({
      value: teacher.id,
      label: teacher.name,
    })),
    placeholder: "Select teacher",
    disabled: options.disabledFields?.includes("teacherId"),
  },
  {
    name: "class",
    label: "Class",
    type: "select" as const,
    options: options.classes.map((cls) => ({
      value: cls,
      label: cls,
    })),
    placeholder: "Select class",
    className: "md:col-span-1",
  },
  {
    name: "lessonDate",
    label: "Lesson Date",
    type: "date" as const,
    placeholder: "Select lesson date",
    className: "md:col-span-1",
  },
  {
    name: "fileType",
    label: "File Type",
    type: "select" as const,
    options: options.fileTypes.map((type) => ({
      value: type.toLowerCase().replaceAll(" ", "_"),
      label: type,
    })),
    placeholder: "Select file type",
  },
  {
    name: "copies",
    label: "Number of Copies",
    type: "number" as const,
    min: 1,
    placeholder: "Enter number of copies",
    className: "md:col-span-1",
  },
  {
    name: "paperColor",
    label: "Paper Color",
    type: "select" as const,
    options: options.paperColors.map((color) => ({
      value: color.toLowerCase(),
      label: color,
    })),
    placeholder: "Select paper color",
    className: "md:col-span-1",
  },
  {
    name: "printSettings.doubleSided",
    label: "Double Sided",
    type: "checkbox" as const,
    className: "md:col-span-1",
  },
  {
    name: "printSettings.stapled",
    label: "Stapled",
    type: "checkbox" as const,
    className: "md:col-span-1",
  },
  {
    name: "printSettings.booklet",
    label: "Booklet",
    type: "checkbox" as const,
    className: "md:col-span-1",
  },
  {
    name: "printSettings.hasCover",
    label: "Has Cover",
    type: "checkbox" as const,
    className: "md:col-span-1",
  },
  {
    name: "printSettings.coloredCover",
    label: "Colored Cover",
    type: "checkbox" as const,
    className: "md:col-span-1",
  },

  {
    name: "printSettings.color",
    label: "Color Print",
    type: "checkbox" as const,
    className: "md:col-span-1",
  },
  {
    name: "notes",
    label: "Notes (Optional)",
    type: "textarea" as const,
    placeholder: "Any special instructions...",
  },
  {
    name: "files",
    label: "Upload Files",
    type: "file" as const,
    multiple: true,
    accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    placeholder: "Drag and drop files here or click to browse",
    className: "md:col-span-2",
  },
];

export type SubmissionField = ReturnType<typeof getSubmissionFields>[number];

