import { useSubmissions } from "@/hooks/queries/useSubmissions";
import { submissionService } from "@/services/submissionService";
import { QUERY_KEYS } from "@/config";
import type { SubmissionQueryParams } from "@/types";

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
