import { useQuery } from "@tanstack/react-query";
import { termsService } from "@/services/termsService";
import { QUERY_KEYS } from "@/config";
import type { Term } from "@/types";

export const useActiveTerm = () => {
  const query = useQuery<Term | null>({
    queryKey: [QUERY_KEYS.TERMS],
    queryFn: () => termsService.getActive(),
  });

  return {
    term: query.data ?? null,
    isLoading: query.isLoading,
  };
};
