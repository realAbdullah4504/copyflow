import { AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Student } from "@/types";

interface ConsecutiveAbsenceAlertsProps {
  alerts: { student: Student; consecutiveAbsences: number; lastAbsenceDate: string }[];
  onMarkNoted: (studentId: string, lastAbsenceDate: string) => void;
  isMarking: boolean;
  readOnly: boolean;
}

const ConsecutiveAbsenceAlerts = ({
  alerts,
  onMarkNoted,
  isMarking,
  readOnly,
}: ConsecutiveAbsenceAlertsProps) => {
  if (alerts.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border-2 border-destructive/50 bg-destructive/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h3 className="font-semibold text-destructive">
          Consecutive Absence Alerts ({alerts.length})
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        The following students have been absent for 3 or more consecutive school days and need attention.
      </p>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.student.id}
            className="flex items-center justify-between rounded-md bg-background border border-destructive/30 px-4 py-3"
          >
            <div>
              <span className="font-medium">
                {alert.student.lastName}, {alert.student.firstName}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                (Grade {alert.student.grade})
              </span>
              <span className="ml-3 text-sm font-semibold text-destructive">
                {alert.consecutiveAbsences} consecutive days absent
              </span>
            </div>
            {!readOnly && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkNoted(alert.student.id, alert.lastAbsenceDate)}
                disabled={isMarking}
                className="gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Mark as Noted
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsecutiveAbsenceAlerts;
