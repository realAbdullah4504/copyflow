import { submissionService } from "@/services/submissionService";
import { useSubmissions } from "./useSubmissions";

export const useSubmissionsByTeacher = (teacherId: string) => {
    const {submissions, isLoading} = useSubmissions("teacher", () => submissionService.getSubmissionsByTeacher(teacherId));
    return {submissions, isLoading}
}