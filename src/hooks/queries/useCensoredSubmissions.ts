import { useSubmissions } from "./useSubmissions";
import { submissionService } from "@/services/submissionService";
import { QUERY_KEYS } from "@/config";
import type { SubmissionQueryParams } from "@/types";

export const useCensoredSubmissions = (
  adminId: string,
  params?: SubmissionQueryParams
) => {
  const queryKey = params
    ? [QUERY_KEYS.CENSORED_SUBMISSIONS, adminId, params]
    : [QUERY_KEYS.CENSORED_SUBMISSIONS, adminId];

  const { data, isLoading, ...rest } = useSubmissions(
    queryKey,
    () => submissionService.getCensoredSubmissions(adminId, params),
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
