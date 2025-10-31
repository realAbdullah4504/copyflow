import { useSubmissions } from "./useSubmissions";
import { submissionService } from "../../services/submissionService";
import { QUERY_KEYS } from "@/config";
import type { SubmissionQueryParams } from "@/types";

export const useArchivedSubmissions = (params?: SubmissionQueryParams) => {
  const queryKey = params
    ? [QUERY_KEYS.ARCHIVED_SUBMISSIONS, params]
    : [QUERY_KEYS.ARCHIVED_SUBMISSIONS];
  const { data, isLoading } = useSubmissions(
    queryKey,
    async () => {
      const data = await submissionService.getArchivedSubmissions(params);
      return { data: data.data, total: data.total };
    },
    {
      keepPreviousData: true,
    }
  );
  return { submissions: data?.data || [], total: data?.total || 0, isLoading };
};
