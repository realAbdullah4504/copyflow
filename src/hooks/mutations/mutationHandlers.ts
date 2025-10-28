import type { QueryKeys } from "@/config";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

const invalidate = (keys: QueryKeys[]) => {
    for (const key of keys) {
      queryClient.invalidateQueries({ queryKey: [key] });
    }
  };

export const mutationHandlers = (msg: string, keys: QueryKeys[]) => {
  return {
    onSuccess: () => {
      toast.success(msg);
      invalidate(keys);
    },
    onError: (err: Error) => {
      console.error(err);
      toast.error("Something went wrong");
    },
  };
}
