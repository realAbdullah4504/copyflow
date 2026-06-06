import { useQuery } from "@tanstack/react-query";
import { absenceAlertService } from "@/services/absenceAlertService";
import { QUERY_KEYS } from "@/config";
import type { AbsenceAlertNote } from "@/types";

export const useAbsenceAlerts = (termId?: string) => {
  const query = useQuery<AbsenceAlertNote[]>({
    queryKey: [QUERY_KEYS.ABSENCE_ALERTS, termId],
    queryFn: () => absenceAlertService.getByTerm(termId!),
    enabled: Boolean(termId),
  });

  return {
    notes: query.data || [],
    isLoading: query.isLoading,
  };
};
