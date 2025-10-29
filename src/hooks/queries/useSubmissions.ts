import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Submission } from "@/types";
import { type QueryKeys } from "@/config";
import type { PaginationState } from "@tanstack/react-table";

export function useSubmissions(
  key: QueryKeys,
  queryFn: (pagination: PaginationState) => Promise<{ data: Submission[]; total: number }>,
  pagination: PaginationState
) {
  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [key, pagination],
    queryFn: () => queryFn(pagination),
    placeholderData: keepPreviousData,
  });

  return {
    submissions: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    refetch,
  };
}
