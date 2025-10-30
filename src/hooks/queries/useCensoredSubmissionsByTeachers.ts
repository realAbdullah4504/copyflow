import { submissionService } from "@/services/submissionService";
import { useSubmissions } from "./useSubmissions";
import { QUERY_KEYS } from "@/config";

export const useCensoredSubmissionsByTeacher = (teacherId: string) => {
  const { data, isLoading } = useSubmissions(
    [QUERY_KEYS.TEACHER_CENSORED, teacherId],
    async () => {
      const data = await submissionService.getCensoredSubmissionsByTeacher(
        teacherId
      );
      return { data, total: data.length };
    }
  );
  return { submissions: data?.data || [], total: data?.total || 0, isLoading };
};
