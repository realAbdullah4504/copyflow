import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FileType, Submission} from "@/types";
import { useMemo } from "react";
import type { Table } from "@tanstack/react-table";


interface SubmissionFiltersProps {
  table: Table<Submission>;
  data: Submission[];
}

const SubmissionFilters = ({ table, data }: SubmissionFiltersProps) => {
  // Derive grade options from data
  const gradeOptions = useMemo(() => {
    const map = new Map<string, string>();

    for (const s of data ?? []) {
      const id = s.class?.id;
      const label = s.class?.label;

      if (id && label && !map.has(id)) {
        map.set(id, label);
      }
    }

    // Convert Map → array of objects for dropdowns
    return Array.from(map, ([id, label]) => ({ id, label }));
  }, [data]);

  // Helpers to set column filters
  const setColumnValue = (id: keyof Submission, value: string | undefined) => {
    table
      .getColumn(String(id))
      ?.setFilterValue(value === "all" ? undefined : value);
  };

  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <Select
        value={(table.getColumn("class")?.getFilterValue() as string) ?? ""}
        onValueChange={(v) => setColumnValue("class", v || undefined)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Class" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Classes</SelectItem>
          {gradeOptions.map((g) => (
            <SelectItem key={g.id} value={g.id}>
              {g.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={
          (table.getColumn("fileType")?.getFilterValue() as FileType) ?? ""
        }
        onValueChange={(v) =>
          setColumnValue("fileType", (v as FileType) || undefined)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="File Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {(
            [
              "worksheet",
              "exam",
              "handout",
              "lesson_plan",
              "other",
            ] as FileType[]
          ).map((t) => (
            <SelectItem key={t} value={t}>
              {t.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={
          (table.getColumn("lessonDate")?.getFilterValue() as string) ?? ""
        }
        onValueChange={(v) =>
          setColumnValue("lessonDate", v || undefined)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Lesson Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="this_month">This month</SelectItem>
        </SelectContent>
      </Select>

      {/* <Select
        value={
          (table.getColumn("status")?.getFilterValue() as SubmissionStatus) ??
          ""
        }
        onValueChange={(v) =>
          setColumnValue("status", (v as SubmissionStatus) || undefined)
        }
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
      </Select> */}

    </div>
  );
};

export default SubmissionFilters;
