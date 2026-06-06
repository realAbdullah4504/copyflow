import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { Save, ClipboardCheck, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks";
import { useStudents } from "@/hooks/queries/useStudents";
import { useAttendance } from "@/hooks/queries/useAttendance";
import { useActiveTerm } from "@/hooks/queries/useActiveTerm";
import { useTermAttendance } from "@/hooks/queries/useTermAttendance";
import { useAbsenceAlerts } from "@/hooks/queries/useAbsenceAlerts";
import { useAttendanceMutations } from "@/hooks/mutations/useAttendanceMutations";
import { useAbsenceAlertMutations } from "@/hooks/mutations/useAbsenceAlertMutations";
import { grades, sections } from "@/constants/shared";
import type { AttendanceStatus } from "@/types";
import {
  STATUSES,
  isSchoolDay,
  computeAcademicYear,
  getActiveAlerts,
} from "@/components/attendance/attendanceUtils";
import ConsecutiveAbsenceAlerts from "@/components/attendance/ConsecutiveAbsenceAlerts";
import StudentAttendanceRow from "@/components/attendance/StudentAttendanceRow";

interface AttendancePageProps {
  readOnly?: boolean;
}

const AttendancePage = ({ readOnly = false }: AttendancePageProps) => {
  const { user } = useAuth();
  const adminId = user?.adminId;

  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // Active term
  const { term: activeTerm, isLoading: termLoading } = useActiveTerm();

  // All students
  const { students, isLoading: studentsLoading } = useStudents(adminId!);

  // Filter students by grade
  const gradeStudents = useMemo(
    () =>
      students
        .filter((s) => s.grade === selectedGrade && s.section === selectedSection && s.active)
        .sort((a, b) => a.lastName.localeCompare(b.lastName)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [students.length, selectedGrade, selectedSection]
  );

  // Today's attendance for this grade
  const { records: dayRecords, isLoading: dayLoading } = useAttendance(
    selectedGrade || undefined,
    selectedDate || undefined
  );

  // Full-term attendance for counters
  const { records: termRecords } = useTermAttendance(
    selectedGrade || undefined,
    activeTerm?.startDate,
    activeTerm?.endDate
  );

  // Alert notes
  const { notes: alertNotes } = useAbsenceAlerts(activeTerm?.id);

  const { saveAttendance, isSaving } = useAttendanceMutations();
  const { markNoted, isMarking } = useAbsenceAlertMutations();

  // Local statuses
  const [localStatuses, setLocalStatuses] = useState<Record<string, AttendanceStatus>>({});

  // Stable keys for effect deps
  const gradeStudentIds = useMemo(() => gradeStudents.map((s) => s.id).join(","), [gradeStudents]);
  const dayRecordsKey = useMemo(() => dayRecords.map((r) => `${r.studentId}:${r.status}`).join(","), [dayRecords]);

  // Sync from fetched day records
  useEffect(() => {
    const map: Record<string, AttendanceStatus> = {};
    for (const r of dayRecords) {
      map[r.studentId] = r.status;
    }
    for (const s of gradeStudents) {
      if (!map[s.id]) {
        map[s.id] = "present";
      }
    }
    setLocalStatuses(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradeStudentIds, dayRecordsKey]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    if (readOnly) return;
    setLocalStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    if (!selectedGrade || !selectedSection || !selectedDate || readOnly) return;
    const academicYear = computeAcademicYear(selectedDate);
    const batch = gradeStudents.map((s) => ({
      studentId: s.id,
      lessonDate: selectedDate,
      status: localStatuses[s.id] || ("present" as AttendanceStatus),
      academicYear,
    }));
    saveAttendance(batch);
  };

  const handleMarkNoted = (studentId: string, lastAbsenceDate: string) => {
    if (!activeTerm || !user) return;
    markNoted({
      studentId,
      termId: activeTerm.id,
      lastAbsenceDate,
      notedBy: user.id,
    });
  };

  // Summary
  const summary = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const s of gradeStudents) {
      const status = localStatuses[s.id] || "present";
      counts[status]++;
    }
    return counts;
  }, [gradeStudents, localStatuses]);

  // Alerts: students with 3+ consecutive absences
  const alerts = useMemo(() => {
    if (!activeTerm || termRecords.length === 0) return [];
    // Get all active students for this grade
    const allGradeStudents = students.filter((s) => s.grade === selectedGrade && s.active);
    return getActiveAlerts(allGradeStudents, termRecords, alertNotes);
  }, [activeTerm, termRecords, alertNotes, students, selectedGrade]);

  const notASchoolDay = selectedDate && !isSchoolDay(selectedDate);
  const isLoading = studentsLoading || dayLoading;
  const hasSelection = selectedGrade && selectedSection;

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {readOnly ? "View student attendance records" : "Mark and manage student attendance"}
          </p>
          {activeTerm && (
            <Badge variant="secondary" className="mt-1">
              {activeTerm.name} — {activeTerm.academicYear}
            </Badge>
          )}
          {!activeTerm && !termLoading && (
            <Badge variant="destructive" className="mt-1">
              No active term configured
            </Badge>
          )}
        </div>
        {!readOnly && hasSelection && gradeStudents.length > 0 && !notASchoolDay && (
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Attendance
          </Button>
        )}
      </div>

      {/* Filters: Grade + Date only */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="space-y-1">
          <Label className="text-xs">Grade</Label>
          <Select value={selectedGrade} onValueChange={(v) => { setSelectedGrade(v); setSelectedSection(""); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((g) => (
                <SelectItem key={g} value={g}>
                  Grade {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Class</Label>
          <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!selectedGrade}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((s) => (
                <SelectItem key={s} value={s}>
                  {selectedGrade}-{s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Non-school day warning */}
      {notASchoolDay && hasSelection && (
        <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-700 p-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" })} is not a school day. School operates Monday through Thursday only.
          </p>
        </div>
      )}

      {/* Consecutive absence alerts */}
      {hasSelection && (
        <ConsecutiveAbsenceAlerts
          alerts={alerts}
          onMarkNoted={handleMarkNoted}
          isMarking={isMarking}
          readOnly={readOnly}
        />
      )}

      {/* Summary badges */}
      {hasSelection && gradeStudents.length > 0 && !notASchoolDay && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {STATUSES.map((s) => (
            <Badge key={s.value} variant="outline" className={`text-xs ${s.color}`}>
              {s.label}: {summary[s.value]}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs">Total: {gradeStudents.length}</Badge>
        </div>
      )}

      {/* Empty states */}
      {!hasSelection && (
        <Card className="p-12 text-center text-muted-foreground">
          <ClipboardCheck className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>Select a grade and class to view attendance</p>
        </Card>
      )}

      {/* Loading */}
      {isLoading && hasSelection && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* No students */}
      {hasSelection && !isLoading && gradeStudents.length === 0 && (
        <Card className="p-12 text-center text-muted-foreground">
          <p>No active students found for this grade</p>
        </Card>
      )}

      {/* Student list */}
      {hasSelection && !isLoading && gradeStudents.length > 0 && !notASchoolDay && (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {gradeStudents.map((student, idx) => (
              <StudentAttendanceRow
                key={student.id}
                student={student}
                index={idx}
                status={localStatuses[student.id] || "present"}
                termRecords={termRecords}
                onStatusChange={(status) => handleStatusChange(student.id, status)}
                readOnly={readOnly}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AttendancePage;
