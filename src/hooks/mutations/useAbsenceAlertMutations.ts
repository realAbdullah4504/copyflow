import { useMutation } from "@tanstack/react-query";
import { absenceAlertService } from "@/services/absenceAlertService";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "./mutationHandlers";

export const useAbsenceAlertMutations = () => {
  const markNoted = useMutation({
    mutationFn: (params: {
      studentId: string;
      termId: string;
      lastAbsenceDate: string;
      notedBy: string;
    }) => absenceAlertService.markNoted(params),
    ...mutationHandlers({
      successMessage: "Alert marked as noted",
      invalidateKeys: [QUERY_KEYS.ABSENCE_ALERTS],
    }),
  });

  return {
    markNoted: markNoted.mutate,
    isMarking: markNoted.isPending,
  };
};
