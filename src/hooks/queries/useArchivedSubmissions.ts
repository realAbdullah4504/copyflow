import { useSubmissions } from "./useSubmissions";
import { submissionService } from "../../services/submissionService";
import { QUERY_KEYS } from "@/config";
import type { Submission } from "@/types";

export const useArchivedSubmissions = () => {
  const { data, isLoading } = useSubmissions<{
    data: Submission[];
    total: number;
  }>([QUERY_KEYS.ARCHIVED_SUBMISSIONS], async () => {
    const data = await submissionService.getArchivedSubmissions();
    return { data, total: data.length };
  });
  return { submissions: data?.data || [], total: data?.total || 0, isLoading };
};
