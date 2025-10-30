import { useQuery, type UseQueryOptions, type QueryKey } from "@tanstack/react-query";
import type { Submission } from "@/types";

export type SubmissionsResponse = {
  data: Submission[];
  total: number;
};

type UseSubmissionsOptions<TData = SubmissionsResponse, TError = Error> = Omit<
  UseQueryOptions<SubmissionsResponse, TError, TData, QueryKey>,
  'queryKey' | 'queryFn'
> & {
  // Add any custom options specific to useSubmissions here
  keepPreviousData?: boolean;
};

export function useSubmissions<TData = SubmissionsResponse, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<SubmissionsResponse>,
  options?: UseSubmissionsOptions<TData, TError>
) {
  const { keepPreviousData, ...queryOptions } = options || {};

  const result = useQuery<SubmissionsResponse, TError, TData, QueryKey>({
    queryKey,
    queryFn,
    ...(keepPreviousData && { placeholderData: (previousData) => previousData }),
    ...queryOptions,
  });

  return {
    ...result,
    // For backward compatibility
    data: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error,
  };
}

export type { UseSubmissionsOptions };
