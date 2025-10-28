import { submissionService } from "@/services/submissionService";
import { useSubmissions } from "./useSubmissions";
import { QUERY_KEYS } from "@/config";

export const useArchiveSubmissionsByTeacher = (teacherId: string) => {
  const { submissions, isLoading } = useSubmissions(
    QUERY_KEYS.TEACHER_ARCHIVED,
    () => submissionService.getArchivedSubmissionsByTeacher(teacherId),
  );
  return { submissions, isLoading };
};
