import { submissionService } from "@/services/submissionService";
import { useSubmissions } from "./useSubmissions";
import { QUERY_KEYS } from "@/config";

export const useCensoredSubmissionsByTeacher = (teacherId: string) => {
  const { submissions, isLoading } = useSubmissions(
    QUERY_KEYS.TEACHER_CENSORED,
    () => submissionService.getCensoredSubmissionsByTeacher(teacherId),
  );
  return { submissions, isLoading };
};
