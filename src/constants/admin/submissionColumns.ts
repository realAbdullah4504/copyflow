import type { Column } from "@/components/common/DataTable";

export const adminColumns: Column[] = [
  { key: "teacherName", label: "Teacher" },
  { key: "subject", label: "Subject" },
  { key: "grade", label: "Grade" },
  { key: "fileType", label: "Type", format: (v: string) => v.replace("_", " ") },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created", format: (v: string) => new Date(v).toLocaleString() },
];
