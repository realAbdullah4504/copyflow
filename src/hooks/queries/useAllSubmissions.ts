import { useSubmissions } from "@/hooks/queries/useSubmissions";
import { submissionService } from "@/services/submissionService";
import { QUERY_KEYS } from "@/config";
import type { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import type { FileType, SubmissionStatus } from "@/types";

type TimeFrame = "all" | "today" | "7d" | "30d" | "this_month";

export type SubmissionQueryParams = {
  pagination?: PaginationState;
  // Preferred API for server-side filtering
  filters?: {
    grade?: string;
    fileType?: FileType;
    status?: SubmissionStatus;
    timeFrame?: TimeFrame;
  };
  // Incoming from table UI; will be mapped to the filters shape above
  columnFilters?: ColumnFiltersState;
};

export const useAllSubmissions = (params?: SubmissionQueryParams) => {
  // Normalize filters: map columnFilters (from TanStack Table) to the service filters
  const mappedFilters = (() => {
    if (params?.filters) return params.filters;
    const cf = params?.columnFilters;
    if (!cf || cf.length === 0) return undefined;
    const out: SubmissionQueryParams["filters"] = {};
    for (const f of cf) {
      const id = String(f.id);
      const v = f.value as string | undefined;
      if (!v) continue;
      if (id === "grade") out.grade = v;
      else if (id === "fileType") out.fileType = v as FileType;
      else if (id === "status") out.status = v as SubmissionStatus;
      else if (id === "createdAt") out.timeFrame = v as TimeFrame; // validated by UI
    }
    // If empty after mapping, return undefined
    return Object.keys(out).length ? out : undefined;
  })();

  const effectiveParams: SubmissionQueryParams | undefined = params
    ? { pagination: params.pagination, filters: mappedFilters }
    : undefined;

  const queryKey = effectiveParams
    ? [QUERY_KEYS.SUBMISSIONS, effectiveParams]
    : [QUERY_KEYS.SUBMISSIONS];

  const { data, isLoading, ...rest } = useSubmissions(
    queryKey,
    () => submissionService.getSubmissions(effectiveParams),
    {
      keepPreviousData: Boolean(effectiveParams?.pagination),
    }
  );

  return {
    submissions: data?.data || [],
    total: data?.total || 0,
    isLoading,
    ...rest,
  };
};
