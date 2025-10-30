import { useSubmissions } from "./useSubmissions";
import { submissionService } from "@/services/submissionService";
import { QUERY_KEYS } from "@/config";
import type { Submission } from "@/types";

export const useCensoredSubmissions = () => {
  const { data, isLoading, ...rest } = useSubmissions<{ data: Submission[]; total: number }>(
    [QUERY_KEYS.CENSORED_SUBMISSIONS],
    async () => {
      const data = await submissionService.getCensoredSubmissions();
      return { data, total: data.length };
    }
  );
  
  return { 
    submissions: data?.data || [], 
    total: data?.total || 0,
    isLoading, 
    ...rest 
  };
};
  