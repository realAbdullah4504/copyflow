import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Student, AttendanceStatus, AttendanceRecord } from "@/types";
import { STATUSES, computeStudentCounters } from "./attendanceUtils";

interface StudentAttendanceRowProps {
  student: Student;
  index: number;
  status: AttendanceStatus;
  termRecords: AttendanceRecord[];
  onStatusChange: (status: AttendanceStatus) => void;
  readOnly: boolean;
}

const StudentAttendanceRow = ({
  student,
  index,
  status,
  termRecords,
  onStatusChange,
  readOnly,
}: StudentAttendanceRowProps) => {
  const counters = computeStudentCounters(student.id, termRecords);

  return (
    <div className="flex flex-col gap-1 px-3 py-1.5 hover:bg-muted/50 transition-colors sm:flex-row sm:items-center sm:justify-between">
      {/* Name + counters */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs text-muted-foreground w-6 shrink-0">{index + 1}.</span>
        <div className="min-w-0">
          <span className="text-sm font-medium block truncate">
            {student.lastName}, {student.firstName}
          </span>
          <div className="flex gap-1.5 mt-0.5 flex-wrap">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              Absent: {counters.totalAbsent}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
              Late: {counters.totalLate}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Permission: {counters.totalExcused}
            </Badge>
            {counters.consecutiveAbsences > 0 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                Streak: {counters.consecutiveAbsences}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Status buttons */}
      <div className="flex gap-1.5 ml-8 sm:ml-0">
        {STATUSES.map((s) => (
          <Button
            key={s.value}
            size="sm"
            variant={status === s.value ? "default" : "outline"}
            className={`h-7 text-xs px-2.5 ${status === s.value ? s.color : ""}`}
            onClick={() => onStatusChange(s.value)}
            disabled={readOnly}
          >
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StudentAttendanceRow;
