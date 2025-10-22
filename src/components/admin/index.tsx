import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useTodayAttendance } from '@/hooks/useAttendance';
import { FileText, Users, TrendingUp, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { submissions, isLoading: submissionsLoading } = useSubmissions();
  const { attendance, isLoading: attendanceLoading } = useTodayAttendance();

  const stats = {
    totalSubmissions: submissions.length,
    pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
    completedToday: submissions.filter(s =>
      s.status === 'printed' &&
      new Date(s.updatedAt).toDateString() === new Date().toDateString()
    ).length,
    flaggedSubmissions: submissions.filter(s => s.status === 'flagged').length
  };

  const totalStudents = attendance.reduce((sum, record) => sum + record.total, 0);
  const totalPresent = attendance.reduce((sum, record) => sum + record.present, 0);
  const attendanceRate = totalStudents > 0
    ? ((totalPresent / totalStudents) * 100).toFixed(1)
    : 0;

  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600">Total Submissions</div>
                <div className="text-2xl font-bold text-slate-900">{stats.totalSubmissions}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600">Pending</div>
                <div className="text-2xl font-bold text-slate-900">{stats.pendingSubmissions}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600">Completed Today</div>
                <div className="text-2xl font-bold text-slate-900">{stats.completedToday}</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-600">Flagged</div>
                <div className="text-2xl font-bold text-slate-900">{stats.flaggedSubmissions}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Attendance Overview</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Today's Attendance Rate</span>
                <span className="text-2xl font-bold text-green-600">{attendanceRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Students Present</span>
                <span className="text-lg font-semibold">{totalPresent} / {totalStudents}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs text-slate-600">Absent</div>
                  <div className="text-xl font-bold text-red-600">
                    {attendance.reduce((sum, r) => sum + r.absent, 0)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-600">Late</div>
                  <div className="text-xl font-bold text-orange-600">
                    {attendance.reduce((sum, r) => sum + r.late, 0)}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-slate-600" />
              <h3 className="text-lg font-semibold text-slate-900">Teacher Activity</h3>
            </div>
            <div className="space-y-3">
              {teacherActivity.map((teacher, index) => (
                <div
                  key={teacher.name}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">#{index + 1}</span>
                    <span className="text-sm font-medium text-slate-900">{teacher.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {teacher.count} submissions
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Submissions</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : recentSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No submissions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  recentSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.teacherName}</TableCell>
                      <TableCell>{submission.subject}</TableCell>
                      <TableCell>{submission.grade}</TableCell>
                      <TableCell className="capitalize">
                        {submission.fileType.replace('_', ' ')}
                      </TableCell>
                      <TableCell className="capitalize">{submission.status}</TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(submission.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
  );
}
