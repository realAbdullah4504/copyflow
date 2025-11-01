import { submissionService } from "@/services/submissionService";
import { useSubmissions } from "./useSubmissions";
import { QUERY_KEYS } from "@/config";
import type { SubmissionQueryParams } from "@/types";

export const useCensoredSubmissionsByTeacher = (
  teacherId: string,
  params?: SubmissionQueryParams
) => {
  const queryKey = params
    ? [QUERY_KEYS.TEACHER_CENSORED, teacherId, params]
    : [QUERY_KEYS.TEACHER_CENSORED, teacherId];
  const { data, isLoading, ...rest } = useSubmissions(queryKey, () =>
    submissionService.getCensoredSubmissionsByTeacher(teacherId, params)
  );
  return {
    submissions: data?.data || [],
    total: data?.total || 0,
    isLoading,
    ...rest,
  };
};
