import { useSubmissions } from "@/hooks/queries/useSubmissions";
import { submissionService } from "@/services/submissionService";
import { QUERY_KEYS } from "@/config";
import type { PaginationState } from "@tanstack/react-table";
import type { FileType, SubmissionStatus } from "@/types";

type TimeFrame = "all" | "today" | "7d" | "30d" | "this_month";

export type SubmissionFilters = {
  grade?: string;
  fileType?: FileType;
  status?: SubmissionStatus;
  timeFrame?: TimeFrame;
};

export type SortDirection = 'asc' | 'desc';

export type SubmissionSort = {
  id: string;
  desc: boolean;
};

export type SubmissionQueryParams = {
  pagination?: PaginationState;
  filters?: SubmissionFilters;
  sorting?: SubmissionSort[];
};

export const useAllSubmissions = (params?: SubmissionQueryParams) => {
  const queryKey = params
    ? [QUERY_KEYS.SUBMISSIONS, params]
    : [QUERY_KEYS.SUBMISSIONS];

  const { data, isLoading, ...rest } = useSubmissions(
    queryKey,
    () => submissionService.getSubmissions(params),
    {
      keepPreviousData: Boolean(params?.pagination),
    }
  );

  return {
    submissions: data?.data || [],
    total: data?.total || 0,
    isLoading,
    ...rest,
  };
};
