import { useSubmissions } from "./useSubmissions";
import { submissionService } from "../../services/submissionService";

export const useArchivedSubmissions = () => {
    const {submissions, isLoading} = useSubmissions("archived", submissionService.getArchivedSubmissions);
    return {submissions, isLoading}
}