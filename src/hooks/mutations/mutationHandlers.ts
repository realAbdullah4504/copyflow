import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { AppError } from "@/utils";

/**
 * Invalidates a list of React Query keys.
 */
const invalidate = (keys: unknown[]) => {
  for (const key of keys) {
    queryClient.invalidateQueries({ queryKey: [key] });
  }
};

/**
 * Generic mutation handlers for useMutation hooks.
 *   
 * @template TData - Success data type
 */
export const mutationHandlers = <
  TData = unknown,
>(
  options: {
    successMessage?: string;
    errorMessage?: string;
    invalidateKeys?: unknown[];
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
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
    onError: (error: Error) => {
      console.error(error);
      toast.error(error.message || errorMessage);
      onError?.(error);
    },
  };
};
