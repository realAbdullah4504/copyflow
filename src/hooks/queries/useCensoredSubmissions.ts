import { useSubmissions } from "./useSubmissions";
import { submissionService } from "../../services/submissionService";
import { QUERY_KEYS } from "@/config";

export const useCensoredSubmissions = () => {
  const { submissions, isLoading } = useSubmissions(
    QUERY_KEYS.CENSORED_SUBMISSIONS,
    submissionService.getCensoredSubmissions
  );
  return { submissions, isLoading };
};
