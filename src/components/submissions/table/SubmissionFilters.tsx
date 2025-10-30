import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FileType, Submission, SubmissionStatus } from "@/types";
import { useMemo } from "react";
import type { Table } from "@tanstack/react-table";

const timeFrameOptions = [
  "all",
  "today",
  "7d",
  "30d",
  "this_month",
] as const;

type TimeFrame = (typeof timeFrameOptions)[number];

interface SubmissionFiltersProps {
  table: Table<Submission>;
  data: Submission[];
}

const SubmissionFilters = ({ table, data }: SubmissionFiltersProps) => {
  // Derive grade options from data
  const gradeOptions = useMemo(() => {
    const set = new Set<string>();
    for (const s of data ?? []) set.add(s.grade);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [data]);

  // Helpers to set column filters
  const setColumnValue = (id: keyof Submission, value: string | undefined) => {
    table.getColumn(String(id))?.setFilterValue(value === 'all' ? undefined : value);
  };

  // Time frame filter uses the createdAt column's filter with a custom token
  const createdAtCol = table.getColumn("createdAt");
  const currentTimeFrame = (createdAtCol?.getFilterValue() as TimeFrame) ?? "all";

  const handleTimeFrame = (value: TimeFrame) => {
    createdAtCol?.setFilterValue(value === 'all' ? undefined : value);
  };

  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <Select
        value={(table.getColumn("grade")?.getFilterValue() as string) ?? ""}
        onValueChange={(v) => setColumnValue("grade", v || undefined)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Class" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Classes</SelectItem>
          {gradeOptions.map((g) => (
            <SelectItem key={g} value={g}>
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={(table.getColumn("fileType")?.getFilterValue() as FileType) ?? ""}
        onValueChange={(v) => setColumnValue("fileType", (v as FileType) || undefined)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="File Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {(["worksheet", "exam", "handout", "lesson_plan", "other"] as FileType[]).map(
            (t) => (
              <SelectItem key={t} value={t}>
                {t.replace("_", " ")}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      <Select
        value={(table.getColumn("status")?.getFilterValue() as SubmissionStatus) ?? ""}
        onValueChange={(v) => setColumnValue("status", (v as SubmissionStatus) || undefined)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {(["pending", "censored"] as SubmissionStatus[]).map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentTimeFrame} onValueChange={(v) => handleTimeFrame(v as TimeFrame)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Time Frame" />
        </SelectTrigger>
        <SelectContent>
          {timeFrameOptions.map((tf) => (
            <SelectItem key={tf} value={tf}>
              {tf === "all"
                ? "All Time"
                : tf === "today"
                ? "Today"
                : tf === "7d"
                ? "Last 7 days"
                : tf === "30d"
                ? "Last 30 days"
                : "This month"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubmissionFilters;
