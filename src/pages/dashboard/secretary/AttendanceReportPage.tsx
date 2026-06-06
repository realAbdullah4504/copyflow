import { useState, useMemo } from "react";
import { Loader2, BarChart3, ChevronDown, ChevronRight, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks";
import { useStudents } from "@/hooks/queries/useStudents";
import { useActiveTerm } from "@/hooks/queries/useActiveTerm";
import { useTermAttendance } from "@/hooks/queries/useTermAttendance";
import { useAbsenceAlerts } from "@/hooks/queries/useAbsenceAlerts";
import { useAbsenceAlertMutations } from "@/hooks/mutations/useAbsenceAlertMutations";
import { grades, sections } from "@/constants/shared";
import type { Student, AttendanceRecord } from "@/types";
import {
  computeStudentCounters,
  getActiveAlerts,
} from "@/components/attendance/attendanceUtils";
import ConsecutiveAbsenceAlerts from "@/components/attendance/ConsecutiveAbsenceAlerts";

interface ReportProps {
  readOnly?: boolean;
}

interface StudentReportRow {
  student: Student;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  consecutiveAbsences: number;
  lastAbsenceDate: string | null;
  absenceDates: string[];
  lateDates: string[];
  excusedDates: string[];
}

function buildStudentReport(student: Student, termRecords: AttendanceRecord[]): StudentReportRow {
  const counters = computeStudentCounters(student.id, termRecords);
  const studentRecords = termRecords.filter((r) => r.studentId === student.id);

  return {
    student,
    ...counters,
    absenceDates: studentRecords.filter((r) => r.status === "absent").map((r) => r.lessonDate).sort(),
    lateDates: studentRecords.filter((r) => r.status === "late").map((r) => r.lessonDate).sort(),
    excusedDates: studentRecords.filter((r) => r.status === "excused").map((r) => r.lessonDate).sort(),
  };
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

const AttendanceReportPage = ({ readOnly = false }: ReportProps) => {
  const { user } = useAuth();
  const adminId = user?.adminId ?? (user?.role === "admin" ? user?.id : undefined);

  const [selectedClass, setSelectedClass] = useState<string>("");
  const selectedGrade = selectedClass ? selectedClass.split("-")[0] : "";
  const selectedSection = selectedClass ? selectedClass.split("-")[1] : "";
  const [problemOnly, setProblemOnly] = useState(false);
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());

  const { term: activeTerm, isLoading: termLoading } = useActiveTerm();
  const { students, isLoading: studentsLoading } = useStudents(adminId!);

  const gradeStudents = useMemo(
    () =>
      students
        .filter((s) => s.grade === selectedGrade && s.section === selectedSection && s.active)
        .sort((a, b) => a.lastName.localeCompare(b.lastName)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [students.length, selectedGrade, selectedSection]
  );

  const { records: termRecords, isLoading: termLoading2 } = useTermAttendance(
    selectedGrade || undefined,
    activeTerm?.startDate,
    activeTerm?.endDate
  );

  const { notes: alertNotes } = useAbsenceAlerts(activeTerm?.id);
  const { markNoted, isMarking } = useAbsenceAlertMutations();

  const reportRows = useMemo(() => {
    let rows = gradeStudents.map((s) => buildStudentReport(s, termRecords));
    // Sort by most absences first
    rows.sort((a, b) => b.totalAbsent - a.totalAbsent || b.totalLate - a.totalLate);
    if (problemOnly) {
      rows = rows.filter((r) => r.totalAbsent > 0 || r.totalLate > 0 || r.totalExcused > 0);
    }
    return rows;
  }, [gradeStudents, termRecords, problemOnly]);

  const alerts = useMemo(() => {
    if (!activeTerm || termRecords.length === 0) return [];
    const allGradeStudents = students.filter((s) => s.grade === selectedGrade && s.active);
    return getActiveAlerts(allGradeStudents, termRecords, alertNotes);
  }, [activeTerm, termRecords, alertNotes, students, selectedGrade]);

  const handleMarkNoted = (studentId: string, lastAbsenceDate: string) => {
    if (!activeTerm || !user) return;
    markNoted({
      studentId,
      termId: activeTerm.id,
      lastAbsenceDate,
      notedBy: user.id,
    });
  };

  const toggleExpanded = (studentId: string) => {
    setExpandedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  };

  const hasSelection = selectedGrade && selectedSection;
  const isLoading = studentsLoading || termLoading2;

  // Term-level summary
  const termSummary = useMemo(() => {
    const total = gradeStudents.length;
    const withAbsences = reportRows.filter((r) => r.totalAbsent > 0).length;
    const withLates = reportRows.filter((r) => r.totalLate > 0).length;
    return { total, withAbsences, withLates };
  }, [gradeStudents, reportRows]);

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight">Attendance Report</h1>
        <p className="text-sm text-muted-foreground">
          Term-level attendance overview with drill-down
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

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <Label className="text-xs">Class</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((g) => (
                <SelectGroup key={g}>
                  <SelectLabel className="text-xs text-muted-foreground">Grade {g}</SelectLabel>
                  {sections.map((s) => (
                    <SelectItem key={`${g}-${s}`} value={`${g}-${s}`}>{g}-{s}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 flex items-end">
          <div className="flex items-center gap-2 h-9 px-2">
            <Switch
              id="problem-only"
              checked={problemOnly}
              onCheckedChange={setProblemOnly}
            />
            <Label htmlFor="problem-only" className="text-xs cursor-pointer">
              <Filter className="inline h-3 w-3 mr-1" />
              Problem cases only
            </Label>
          </div>
        </div>
      </div>

      {/* Consecutive absence alerts */}
      {hasSelection && (
        <ConsecutiveAbsenceAlerts
          alerts={alerts}
          onMarkNoted={handleMarkNoted}
          isMarking={isMarking}
          readOnly={readOnly}
        />
      )}

      {/* Summary cards */}
      {hasSelection && !isLoading && gradeStudents.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold">{termSummary.total}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{termSummary.withAbsences}</p>
            <p className="text-xs text-muted-foreground">With Absences</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{termSummary.withLates}</p>
            <p className="text-xs text-muted-foreground">With Lates</p>
          </Card>
        </div>
      )}

      {/* Empty states */}
      {!hasSelection && (
        <Card className="p-12 text-center text-muted-foreground">
          <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>Select a grade and class to view the report</p>
        </Card>
      )}

      {isLoading && hasSelection && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {hasSelection && !isLoading && gradeStudents.length === 0 && (
        <Card className="p-12 text-center text-muted-foreground">
          <p>No active students found for this class</p>
        </Card>
      )}

      {hasSelection && !isLoading && reportRows.length === 0 && gradeStudents.length > 0 && problemOnly && (
        <Card className="p-12 text-center text-muted-foreground">
          <p>No problem cases found — all students have perfect attendance!</p>
        </Card>
      )}

      {/* Student report rows */}
      {hasSelection && !isLoading && reportRows.length > 0 && (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {reportRows.map((row, idx) => {
              const isExpanded = expandedStudents.has(row.student.id);
              const hasIssues = row.totalAbsent > 0 || row.totalLate > 0 || row.totalExcused > 0;

              return (
                <div key={row.student.id}>
                  <button
                    onClick={() => hasIssues && toggleExpanded(row.student.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors text-left ${
                      hasIssues ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {hasIssues ? (
                        isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )
                      ) : (
                        <span className="w-4 shrink-0" />
                      )}
                      <span className="text-xs text-muted-foreground w-6 shrink-0">{idx + 1}.</span>
                      <span className="text-sm font-medium truncate">
                        {row.student.lastName}, {row.student.firstName}
                      </span>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      {row.totalAbsent > 0 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
                          Absent: {row.totalAbsent}
                        </Badge>
                      )}
                      {row.totalLate > 0 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                          Late: {row.totalLate}
                        </Badge>
                      )}
                      {row.totalExcused > 0 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          Permission: {row.totalExcused}
                        </Badge>
                      )}
                      {row.consecutiveAbsences >= 3 && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                          Streak: {row.consecutiveAbsences}
                        </Badge>
                      )}
                      {!hasIssues && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                          Perfect
                        </Badge>
                      )}
                    </div>
                  </button>

                  {/* Expanded drill-down */}
                  {isExpanded && hasIssues && (
                    <div className="px-4 pb-3 pt-1 ml-12 space-y-2 bg-muted/30">
                      {row.absenceDates.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">
                            Absent ({row.absenceDates.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {row.absenceDates.map((d) => (
                              <Badge key={d} variant="outline" className="text-[10px] bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300">
                                {formatDate(d)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {row.lateDates.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                            Late ({row.lateDates.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {row.lateDates.map((d) => (
                              <Badge key={d} variant="outline" className="text-[10px] bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300">
                                {formatDate(d)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {row.excusedDates.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                            Permission ({row.excusedDates.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {row.excusedDates.map((d) => (
                              <Badge key={d} variant="outline" className="text-[10px] bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                                {formatDate(d)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AttendanceReportPage;
