import { submissionService } from "@/services/submissionService";
import { useSubmissions } from "./useSubmissions";
import { QUERY_KEYS } from "@/config";
import type { SubmissionQueryParams } from "@/types";

export const useArchiveSubmissionsByTeacher = (
  teacherId: string,
  params?: SubmissionQueryParams
) => {
  const queryKey = params
    ? [QUERY_KEYS.TEACHER_ARCHIVED, params]
    : [QUERY_KEYS.TEACHER_ARCHIVED];
  const { data, isLoading } = useSubmissions(queryKey, () =>
    submissionService.getArchivedSubmissionsByTeacher(teacherId, params)
  );
  return { submissions: data?.data || [], total: data?.total || 0, isLoading };
};
