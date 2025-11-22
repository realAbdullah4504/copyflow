import { useSubmissions } from "@/hooks/queries/useSubmissions";
import { submissionService } from "@/services/submissionService";
import { QUERY_KEYS } from "@/config";
import type { SubmissionQueryParams } from "@/types";

export const useAllSubmissions = (
  adminId: string,
  params?: SubmissionQueryParams
) => {
  const queryKey = params
    ? [QUERY_KEYS.SUBMISSIONS, adminId, params]
    : [QUERY_KEYS.SUBMISSIONS, adminId];

  const { data, isLoading, ...rest } = useSubmissions(
    queryKey,
    () => submissionService.getSubmissions(adminId, params),
    {
      keepPreviousData: Boolean(params?.pagination),
      enabled: !!adminId,
    }
  );

  return {
    submissions: data?.data || [],
    total: data?.total || 0,
    isLoading,
    ...rest,
  };
};
