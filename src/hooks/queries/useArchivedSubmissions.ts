import { useSubmissions } from "./useSubmissions";
import { submissionService } from "../../services/submissionService";
import { QUERY_KEYS } from "@/config";

export const useArchivedSubmissions = () => {
    const {submissions, isLoading} = useSubmissions(QUERY_KEYS.ARCHIVED_SUBMISSIONS, submissionService.getArchivedSubmissions);
    return {submissions, isLoading}
}