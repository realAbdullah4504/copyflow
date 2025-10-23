import { useSubmissions } from "@/hooks/useSubmissions";
import { useTodayAttendance } from "@/hooks/useAttendance";
import { DataTable } from "@/components/common";
import {
  StatsCard,
  TeacherActivityCard,
  AttendenceCard,
} from "@/components/admin/overview";
import { ADMIN_STAT_DATA } from "@/constants/admin/statsCards";
import { SUBMISSION_COLUMNS } from "@/components/submissions/columns/columnsDef";

export default function AdminDashboardPage() {
  const { submissions, isLoading: submissionsLoading } = useSubmissions();
  const { attendance, isLoading: attendanceLoading } = useTodayAttendance();

  // compute stats
  const stats = {
    totalSubmissions: submissions.length,
    pendingSubmissions: submissions.filter((s) => s.status === "pending")
      .length,
    completedToday: submissions.filter(
      (s) =>
        s.status === "printed" &&
        new Date(s.updatedAt).toDateString() === new Date().toDateString()
    ).length,
    flaggedSubmissions: submissions.filter((s) => s.status === "flagged")
      .length,
  };

  const totalStudents = attendance.reduce((sum, r) => sum + r.total, 0);
  const totalPresent = attendance.reduce((sum, r) => sum + r.present, 0);
  const attendanceRate =
    totalStudents > 0 ? ((totalPresent / totalStudents) * 100).toFixed(1) : 0;
  const absent = attendance.reduce((sum, r) => sum + r.absent, 0);
  const late = attendance.reduce((sum, r) => sum + r.late, 0);

  const recentSubmissions = [...submissions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const teacherActivity = Object.entries(
    submissions.reduce((acc, submission) => {
      acc[submission.teacherName] = (acc[submission.teacherName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {ADMIN_STAT_DATA.map((card) => (
          <StatsCard
            key={card.label}
            icon={card.icon}
            iconBg={card.iconBg}
            label={card.label}
            value={stats[card.valueKey as keyof typeof stats]}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AttendenceCard
          attendanceRate={attendanceRate}
          totalPresent={totalPresent}
          totalStudents={totalStudents}
          absent={absent}
          late={late}
        />
        <TeacherActivityCard teacherActivity={teacherActivity} />
      </div>

      <DataTable
        data={recentSubmissions}
        isLoading={submissionsLoading}
        columns={SUBMISSION_COLUMNS.ADMIN}
        maxRows={5}
        title="Recent Submissions"
      />
    </div>
  );
}
