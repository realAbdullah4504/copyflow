import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

/**
 * Invalidates a list of React Query keys.
 */
const invalidate = (keys: unknown[]) => {
  keys.forEach((key) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  });
};

/**
 * Generic mutation handlers for useMutation hooks.
 * 
 * @template TError - Error type (defaults to Error)
 * @template TData - Success data type
 * @template TVariables - Variables type passed to mutation
 */
export const mutationHandlers = <
  TError extends Error = Error,
  TData = unknown,
  TVariables = unknown
>(
  options: {
    successMessage?: string;
    errorMessage?: string;
    invalidateKeys?: unknown[];
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
  } = {}
) => {
  const {
    successMessage = "Operation successful",
    errorMessage = "Something went wrong",
    invalidateKeys = [],
    onSuccess,
    onError,
  } = options;

  return {
    onSuccess: (data: TData) => {
      if (successMessage) toast.success(successMessage);
      if (invalidateKeys.length > 0) invalidate(invalidateKeys);
      onSuccess?.(data);
    },
    onError: (error: TError) => {
      console.error(error);
      toast.error(errorMessage);
      onError?.(error);
    },
  };
};
