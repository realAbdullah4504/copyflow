import { useSubmissions } from "./useSubmissions";
import { submissionService } from "../../services/submissionService";
import { QUERY_KEYS } from "@/config";
import type { PaginationState } from "@tanstack/react-table";

export const useAllSubmissions = (pagination: PaginationState) => {
  const { submissions,total, isLoading } = useSubmissions(
    QUERY_KEYS.SUBMISSIONS,
    submissionService.getSubmissions,
    pagination
  );
  return { submissions,total, isLoading };
};
