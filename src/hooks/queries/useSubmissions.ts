import { useQuery } from "@tanstack/react-query";
import type { Submission } from "@/types";
import { type QueryKeys } from "@/config";

export function useSubmissions(
  key: QueryKeys,
  queryFn: () => Promise<Submission[]>
) {
  const {
    data: submissions = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [key],
    queryFn: queryFn,
  });

  return {
    submissions,
    isLoading,
    refetch,
  };
}
