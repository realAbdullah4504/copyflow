import { useMutation } from "@tanstack/react-query";
import { attendanceService } from "@/services/attendanceService";
import { QUERY_KEYS } from "@/config";
import { mutationHandlers } from "./mutationHandlers";
import type { AttendanceStatus } from "@/types";

export const useAttendanceMutations = () => {
  const saveAttendance = useMutation({
    mutationFn: (
      records: {
        studentId: string;
        lessonDate: string;
        status: AttendanceStatus;
        academicYear: string;
      }[]
    ) => attendanceService.upsertBatch(records),
    ...mutationHandlers({
      successMessage: "Attendance saved successfully",
      invalidateKeys: [QUERY_KEYS.ATTENDANCE],
    }),
  });

  return {
    saveAttendance: saveAttendance.mutate,
    isSaving: saveAttendance.isPending,
  };
};
