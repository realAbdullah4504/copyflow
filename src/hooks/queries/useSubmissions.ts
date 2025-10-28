import { useQuery } from "@tanstack/react-query";
import type { Submission } from "@/types";

export function useSubmissions(
  type: string,
  queryFn: () => Promise<Submission[]>
) {
  const {
    data: submissions = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["submissions", type],
    queryFn: queryFn,
  });

  return {
    submissions,
    isLoading,
    refetch,
  };
}
