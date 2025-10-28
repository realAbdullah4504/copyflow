import { useSubmissions } from "./useSubmissions";
import { submissionService } from "../../services/submissionService";

export const useCensoredSubmissions = () => {
  const { submissions, isLoading } = useSubmissions(
    "censored",
    submissionService.getCensoredSubmissions
  );
  return { submissions, isLoading };
};
