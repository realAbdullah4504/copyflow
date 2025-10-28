import { useSubmissions } from "./useSubmissions";
import { submissionService } from "../../services/submissionService";

export const useAllSubmissions = () => {
    const {submissions, isLoading} = useSubmissions("all", submissionService.getSubmissions);
    return {submissions, isLoading}
}