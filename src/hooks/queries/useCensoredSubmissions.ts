import { useSubmissions } from "./useSubmissions";
import { submissionService } from "@/services/submissionService";
import { QUERY_KEYS } from "@/config";
import type { SubmissionQueryParams } from "@/types";

export const useCensoredSubmissions = (params?: SubmissionQueryParams) => {
  const queryKey = params
    ? [QUERY_KEYS.CENSORED_SUBMISSIONS, params]
    : [QUERY_KEYS.CENSORED_SUBMISSIONS];

  const { data, isLoading, ...rest } = useSubmissions(
    queryKey,
    () => submissionService.getCensoredSubmissions(params),
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
