import { useSubmissions } from "./useSubmissions";
import { submissionService } from "../../services/submissionService";
import { QUERY_KEYS } from "@/config";

export const useAllSubmissions = () => {
    const {submissions, isLoading} = useSubmissions(QUERY_KEYS.SUBMISSIONS, submissionService.getSubmissions);
    return {submissions, isLoading}
}