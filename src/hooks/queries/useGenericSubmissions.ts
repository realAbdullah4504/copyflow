import { useQuery } from "@tanstack/react-query";
import type { Submission } from "@/types";
import { QUERY_KEYS, type QueryKeys } from "@/config";

// Define a map that links each service function name to its query key
const SERVICE_KEY_MAP: Record<string, QueryKeys> = {
  getSubmissions: QUERY_KEYS.SUBMISSIONS,
  getSubmissionsByTeacher: QUERY_KEYS.TEACHER_SUBMISSIONS,
  getArchivedSubmissions: QUERY_KEYS.ARCHIVED_SUBMISSIONS,
  getCensoredSubmissions: QUERY_KEYS.CENSORED_SUBMISSIONS,
};

type ServiceFn = (...args: any[]) => Promise<Submission[]>;

export function useSubmissionsQuery<T extends ServiceFn>(
  serviceFn: T,
  ...params: Parameters<T>
) {
  // Infer query key dynamically based on service name
  const key =
    SERVICE_KEY_MAP[serviceFn.name] ?? QUERY_KEYS.SUBMISSIONS;

  const {
    data: submissions = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: [key, ...params],
    queryFn: () => serviceFn(...params),
  });

  return { submissions, isLoading, refetch, error };
}
