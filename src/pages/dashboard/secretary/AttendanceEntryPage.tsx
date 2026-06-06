import { useState, useMemo, useEffect, useCallback } from "react";
import { format, addDays, subDays } from "date-fns";
import { Save, Loader2, AlertTriangle, ChevronLeft, ChevronRight, ChevronDown, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks";
import { useStudents } from "@/hooks/queries/useStudents";
import { useAllAttendanceByDate } from "@/hooks/queries/useAllAttendanceByDate";
import { useActiveTerm } from "@/hooks/queries/useActiveTerm";
import { useAttendanceMutations } from "@/hooks/mutations/useAttendanceMutations";
import { grades, sections } from "@/constants/shared";
import type { AttendanceStatus, Student } from "@/types";
import {
  STATUSES,
  isSchoolDay,
  computeAcademicYear,
} from "@/components/attendance/attendanceUtils";

interface AttendanceEntryPageProps {
  readOnly?: boolean;
}

const GRADE_ACCENT: Record<string, string> = {
  "9": "from-emerald-500/10 to-emerald-500/5 border-l-emerald-500",
  "10": "from-blue-500/10 to-blue-500/5 border-l-blue-500",
  "11": "from-violet-500/10 to-violet-500/5 border-l-violet-500",
  "12": "from-amber-500/10 to-amber-500/5 border-l-amber-500",
};

const GRADE_DOT: Record<string, string> = {
  "9": "bg-emerald-500",
  "10": "bg-blue-500",
  "11": "bg-violet-500",
  "12": "bg-amber-500",
};

const AttendanceEntryPage = ({ readOnly = false }: AttendanceEntryPageProps) => {
  const { user } = useAuth();
  const adminId = user?.adminId ?? (user?.role === "admin" ? user?.id : undefined);

  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const { term: activeTerm, isLoading: termLoading } = useActiveTerm();
  const { students, isLoading: studentsLoading } = useStudents(adminId!);
  const { records: dayRecords, isLoading: dayLoading } = useAllAttendanceByDate(selectedDate);
  const { saveAttendance, isSaving } = useAttendanceMutations();

  // Group students by grade → section
  const studentsByGradeSection = useMemo(() => {
    const map: Record<string, Record<string, Student[]>> = {};
    for (const g of grades) {
      map[g] = {};
      for (const s of sections) {
        map[g][s] = [];
      }
    }
    for (const s of students) {
      if (!s.active) continue;
      if (map[s.grade]?.[s.section]) {
        map[s.grade][s.section].push(s);
      }
    }
    for (const g of grades) {
      for (const sec of sections) {
        map[g][sec].sort((a, b) => a.lastName.localeCompare(b.lastName));
      }
    }
    return map;
  }, [students]);

  const [localStatuses, setLocalStatuses] = useState<Record<string, AttendanceStatus>>({});

  const dayRecordsKey = useMemo(() => dayRecords.map((r) => `${r.studentId}:${r.status}`).join(","), [dayRecords]);
  const studentCount = students.filter((s) => s.active).length;

  useEffect(() => {
    const map: Record<string, AttendanceStatus> = {};
    for (const r of dayRecords) {
      map[r.studentId] = r.status;
    }
    for (const s of students) {
      if (s.active && !map[s.id]) {
        map[s.id] = "present";
      }
    }
    setLocalStatuses(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayRecordsKey, studentCount]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    if (readOnly) return;
    setLocalStatuses((prev) => ({ ...prev, [studentId]: status }));
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSaveAll = useCallback(() => {
    if (readOnly || !selectedDate) return;
    const academicYear = computeAcademicYear(selectedDate);
    const batch = students
      .filter((s) => s.active)
      .map((s) => ({
        studentId: s.id,
        lessonDate: selectedDate,
        status: localStatuses[s.id] || ("present" as AttendanceStatus),
        academicYear,
      }));
    if (batch.length > 0) saveAttendance(batch);
  }, [readOnly, selectedDate, students, localStatuses, saveAttendance]);

  const goPrev = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    setSelectedDate(format(subDays(new Date(y, m - 1, d), 1), "yyyy-MM-dd"));
  };
  const goNext = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    setSelectedDate(format(addDays(new Date(y, m - 1, d), 1), "yyyy-MM-dd"));
  };
  const goToday = () => setSelectedDate(format(new Date(), "yyyy-MM-dd"));

  const notASchoolDay = selectedDate && !isSchoolDay(selectedDate);
  const isLoading = studentsLoading || dayLoading;

  const displayDate = useMemo(() => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    return format(new Date(y, m - 1, d), "EEEE, MMMM d, yyyy");
  }, [selectedDate]);

  const isToday = selectedDate === format(new Date(), "yyyy-MM-dd");

  const getSectionSummary = (sectionStudents: Student[]) => {
    let absent = 0, late = 0, excused = 0;
    for (const s of sectionStudents) {
      const st = localStatuses[s.id] || "present";
      if (st === "absent") absent++;
      else if (st === "late") late++;
      else if (st === "excused") excused++;
    }
    return { absent, late, excused, total: sectionStudents.length };
  };

  // Global summary (used by grade-level getGradeSummary)
  // Removed top-level summary strip per user request

  // Grade-level summary
  const getGradeSummary = (grade: string) => {
    let total = 0, absent = 0, late = 0, excused = 0;
    for (const sec of sections) {
      const sectionStudents = studentsByGradeSection[grade]?.[sec] || [];
      for (const s of sectionStudents) {
        total++;
        const st = localStatuses[s.id] || "present";
        if (st === "absent") absent++;
        else if (st === "late") late++;
        else if (st === "excused") excused++;
      }
    }
    return { total, absent, late, excused };
  };

  // Compute which sections have attendance entered (at least one record exists)
  const sectionEntryStatus = useMemo(() => {
    const entered = new Set<string>();
    for (const r of dayRecords) {
      const student = students.find((s) => s.id === r.studentId);
      if (student) entered.add(`${student.grade}-${student.section}`);
    }
    return entered;
  }, [dayRecords, students]);

  // Progress: how many sections have been entered vs total non-empty sections
  const progressStats = useMemo(() => {
    let totalSections = 0;
    let enteredSections = 0;
    for (const g of grades) {
      for (const s of sections) {
        const sectionStudents = studentsByGradeSection[g]?.[s] || [];
        if (sectionStudents.length === 0) continue;
        totalSections++;
        if (sectionEntryStatus.has(`${g}-${s}`)) enteredSections++;
      }
    }
    return { totalSections, enteredSections };
  }, [studentsByGradeSection, sectionEntryStatus]);

  return (
    <div className="container mx-auto p-5 max-w-6xl">
      {/* Top bar: title + save */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            {readOnly ? "Attendance Viewer" : "Attendance Entry"}
          </h1>
          {activeTerm && (
            <p className="text-sm text-muted-foreground">
              {activeTerm.name} · {activeTerm.academicYear}
            </p>
          )}
          {!activeTerm && !termLoading && (
            <Badge variant="destructive" className="mt-1 text-xs">
              No active term
            </Badge>
          )}
        </div>
        {!readOnly && !notASchoolDay && !isLoading && (
          <Button onClick={handleSaveAll} disabled={isSaving} size="default">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save All
          </Button>
        )}
      </div>

      {/* Date Navigator */}
      <div className="rounded-lg border bg-card shadow-sm mb-5 overflow-hidden">
        <div className="flex items-center">
          <button
            onClick={goPrev}
            className="px-4 py-4 hover:bg-muted/60 transition-colors border-r"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 flex flex-col items-center py-3">
            <span className="text-base font-semibold tracking-tight">{displayDate}</span>
            {isToday ? (
              <span className="text-xs font-medium text-primary uppercase tracking-wider mt-0.5">Today</span>
            ) : (
              <button onClick={goToday} className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5 cursor-pointer">
                <CalendarDays className="h-3 w-3" />
                Back to today
              </button>
            )}
          </div>
          <button
            onClick={goNext}
            className="px-4 py-4 hover:bg-muted/60 transition-colors border-l"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Non-school day */}
      {notASchoolDay && (
        <Card className="mb-5 border-yellow-300 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-950/30">
          <div className="p-4 flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Not a school day — school operates Monday through Thursday.
            </p>
          </div>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Main content */}
      {!isLoading && !notASchoolDay && (
        <>
          {/* Progress bar */}
          <div className="rounded-lg border bg-card shadow-sm mb-5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Attendance Progress</span>
              <span className="text-sm font-bold text-foreground">
                {progressStats.enteredSections}/{progressStats.totalSections} classes
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: progressStats.totalSections > 0
                    ? `${(progressStats.enteredSections / progressStats.totalSections) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {progressStats.enteredSections === progressStats.totalSections
                ? "All classes entered ✓"
                : `${progressStats.totalSections - progressStats.enteredSections} remaining`}
            </p>
          </div>

          {/* Grade cards — 2-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {grades.map((grade) => {
              const gradeSummary = getGradeSummary(grade);
              const accent = GRADE_ACCENT[grade] || "";
              const dot = GRADE_DOT[grade] || "bg-muted-foreground";

              return (
                <Card key={grade} className="overflow-hidden border-l-[3px] border-l-transparent" style={{borderLeftColor: 'inherit'}}>
                  {/* Grade header */}
                  <div className={`px-4 py-3 bg-gradient-to-r ${accent} border-b flex items-center justify-between`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                        Grade {grade}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{gradeSummary.total}</span>
                      {gradeSummary.absent > 0 && (
                        <span className="text-destructive font-medium">· {gradeSummary.absent}A</span>
                      )}
                      {gradeSummary.late > 0 && (
                        <span className="text-yellow-600 font-medium">· {gradeSummary.late}L</span>
                      )}
                    </div>
                  </div>

                  {/* Class sections */}
                  <div className="divide-y divide-border">
                    {sections.map((section) => {
                      const key = `${grade}-${section}`;
                      const sectionStudents = studentsByGradeSection[grade]?.[section] || [];
                      if (sectionStudents.length === 0) return null;
                      const isExpanded = expandedSections.has(key);
                      const summary = getSectionSummary(sectionStudents);
                      const isDone = sectionEntryStatus.has(key);

                      return (
                        <div key={key}>
                          <button
                            onClick={() => toggleSection(key)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/40 transition-colors text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                                  isExpanded ? "" : "-rotate-90"
                                }`}
                              />
                              <span className="text-sm font-semibold">{key}</span>
                              <span className="text-xs text-muted-foreground">
                                ({summary.total})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Collapsed summary pills */}
                              {!isExpanded && (summary.absent > 0 || summary.late > 0 || summary.excused > 0) && (
                                <div className="flex gap-1">
                                  {summary.absent > 0 && (
                                    <span className="text-[10px] font-medium text-destructive bg-destructive/10 rounded px-1.5 py-0.5">
                                      {summary.absent}A
                                    </span>
                                  )}
                                  {summary.late > 0 && (
                                    <span className="text-[10px] font-medium text-yellow-700 bg-yellow-500/10 rounded px-1.5 py-0.5">
                                      {summary.late}L
                                    </span>
                                  )}
                                  {summary.excused > 0 && (
                                    <span className="text-[10px] font-medium text-blue-700 bg-blue-500/10 rounded px-1.5 py-0.5">
                                      {summary.excused}P
                                    </span>
                                  )}
                                </div>
                              )}
                              {/* Entry status indicator */}
                              {isDone ? (
                                <span className="text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                                  ✓ Done
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                                  Pending
                                </span>
                              )}
                            </div>
                          </button>

                          {/* Expanded students */}
                          {isExpanded && (
                            <div className="bg-muted/20">
                              {sectionStudents.length === 0 && (
                                <p className="px-5 py-3 text-sm text-muted-foreground italic">No students</p>
                              )}
                              {sectionStudents.map((student, idx) => {
                                const status = localStatuses[student.id] || "present";
                                return (
                                  <div
                                    key={student.id}
                                    className={`flex items-center justify-between pl-10 pr-4 py-1.5 transition-colors ${
                                      idx % 2 === 0 ? "bg-background/50" : ""
                                    } hover:bg-muted/40`}
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="text-xs text-muted-foreground w-5 shrink-0 text-right">{idx + 1}</span>
                                      <span className="text-sm truncate">
                                        {student.lastName}, {student.firstName}
                                      </span>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                      {STATUSES.map((s) => {
                                        const isActive = status === s.value;
                                        return (
                                          <button
                                            key={s.value}
                                            onClick={() => handleStatusChange(student.id, s.value)}
                                            disabled={readOnly}
                                            className={`h-7 px-2.5 rounded text-xs font-medium transition-all cursor-pointer disabled:cursor-default ${
                                              isActive
                                                ? s.color + " shadow-sm"
                                                : "text-muted-foreground hover:bg-muted/60"
                                            }`}
                                          >
                                            {s.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceEntryPage;
