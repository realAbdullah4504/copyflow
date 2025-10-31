import type { Submission, SubmissionFilters } from "@/types";
import type { PaginationState, SortingState } from "@tanstack/react-table";

export const paginateData = <T>(
  data: T[],
  pagination?: PaginationState
): { data: T[]; total: number } => {
  if (!pagination) {
    return { data, total: data.length };
  }

  const { pageIndex, pageSize } = pagination;
  const start = pageIndex * pageSize;
  const end = start + pageSize;

  return {
    data: data.slice(start, end),
    total: data.length,
  };
};

export const sortData = (
  data: Submission[],
  sorting?: SortingState
): Submission[] => {
  const sorted = [...data];

  if (!sorting || sorting.length === 0) {
    return sorted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  sorted.sort((a, b) => {
    for (const sort of sorting) {
      const aValue = a[sort.id as keyof Submission];
      const bValue = b[sort.id as keyof Submission];

      if (aValue === bValue) continue;

      if (aValue == null) return sort.desc ? -1 : 1;
      if (bValue == null) return sort.desc ? 1 : -1;

      // 🧮 Grade-specific sort logic
      if (
        sort.id === "grade" &&
        typeof aValue === "string" &&
        typeof bValue === "string"
      ) {
        const gradeRegex = /^(\d+)([A-Za-z]*)$/;
        const aMatch = aValue.match(gradeRegex);
        const bMatch = bValue.match(gradeRegex);

        if (aMatch && bMatch) {
          const aNum = parseInt(aMatch[1], 10);
          const bNum = parseInt(bMatch[1], 10);

          if (aNum !== bNum) return sort.desc ? bNum - aNum : aNum - bNum;

          const aLetter = aMatch[2] || "";
          const bLetter = bMatch[2] || "";
          const letterCompare = aLetter.localeCompare(bLetter);
          return sort.desc ? -letterCompare : letterCompare;
        }
      }

      // 🧾 String comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sort.desc
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      // 🕒 Date comparison
      if (aValue instanceof Date && bValue instanceof Date) {
        return sort.desc
          ? bValue.getTime() - aValue.getTime()
          : aValue.getTime() - bValue.getTime();
      }

      // 🔢 Generic comparison
      if (aValue < bValue) return sort.desc ? 1 : -1;
      if (aValue > bValue) return sort.desc ? -1 : 1;
    }
    return 0;
  });

  return sorted;
};

export const filterData = (data: Submission[], filters?: SubmissionFilters) => {
  if (!filters) return data;

  let filtered = [...data];
  const { grade, fileType, status, timeFrame } = filters;

  if (grade) filtered = filtered.filter((s) => s.grade === grade);
  if (fileType) filtered = filtered.filter((s) => s.fileType === fileType);
  if (status) filtered = filtered.filter((s) => s.status === status);

  if (timeFrame && timeFrame !== "all") {
    const now = new Date();
    let from: Date | null = null;

    switch (timeFrame) {
      case "today":
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "7d":
        from = new Date(now);
        from.setDate(from.getDate() - 7);
        break;
      case "30d":
        from = new Date(now);
        from.setDate(from.getDate() - 30);
        break;
      case "this_month":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    if (from) {
      filtered = filtered.filter((s) => new Date(s.createdAt) >= from);
    }
  }

  return filtered;
};
