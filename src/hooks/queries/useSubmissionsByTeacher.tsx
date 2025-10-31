import { submissionService } from "@/services/submissionService";
import { useSubmissions } from "./useSubmissions";
import { QUERY_KEYS } from "@/config";
import type { SubmissionQueryParams } from "@/types";

export const useSubmissionsByTeacher = (
  teacherId: string,
  params?: SubmissionQueryParams
) => {
  const { data, isLoading } = useSubmissions(
    [QUERY_KEYS.TEACHER_SUBMISSIONS, teacherId],
    () => submissionService.getSubmissionsByTeacher(teacherId, params),
    {
      keepPreviousData: Boolean(params?.pagination),
    }
  );
  return { submissions: data?.data || [], total: data?.total || 0, isLoading };
};
