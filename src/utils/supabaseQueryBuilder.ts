import type { SubmissionQueryParams } from "@/types";

export function applyFilters(
  query: any,
  filters?: SubmissionQueryParams["filters"]
) {
  if (!filters) return query;

  const { class: classFilter, fileType, status, timeFrame,lessonDate } = filters;

  if (classFilter) {
    query = query.eq("class_id", classFilter);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (fileType) {
    query = query.eq("file_type", fileType);
  }

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

    if (from) query = query.gte("created_at", from.toISOString());
  }

  if (lessonDate && lessonDate !== "all") {
    const now = new Date();
    let from: Date | null = null;

    switch (lessonDate) {
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

    if (from) query = query.gte("lesson_date", from.toISOString());
  }

  return query;
}

export function applySorting(
  query: any,
  sorting?: SubmissionQueryParams["sorting"]
) {
  const SORT_MAP: Record<string, string> = {
    createdAt: "created_at",
    fileType: "file_type",
    status: "status",
  };

  if (sorting && sorting.length > 0) {
    const sort = sorting[0];
    const column = SORT_MAP[sort.id] ?? sort.id; // fallback to raw key
    return query.order(column, { ascending: !sort.desc });
  }

  return query.order("created_at", { ascending: false });
}


export function applyPagination(
  query: any,
  pagination?: SubmissionQueryParams["pagination"]
) {
  if (!pagination) return query;
  const { pageIndex, pageSize } = pagination;
  const from = pageIndex * pageSize;
  const to = from + pageSize - 1;
  return query.range(from, to);
}
