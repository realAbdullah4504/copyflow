import { submissionService } from "@/services/submissionService";
import { useSubmissions } from "./useSubmissions";
import { QUERY_KEYS } from "@/config";

export const useSubmissionsByTeacher = (teacherId: string) => {
    const {submissions, isLoading} = useSubmissions(QUERY_KEYS.TEACHER_SUBMISSIONS, () => submissionService.getSubmissionsByTeacher(teacherId));
    return {submissions, isLoading}
}