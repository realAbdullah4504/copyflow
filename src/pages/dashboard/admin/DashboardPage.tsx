import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Users, Clock, CheckCircle, Activity, HardDrive, User } from "lucide-react";
import { submissionService } from "@/services/submissionService";
import { authService } from "@/services/authService";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
};

const StatsCard = ({ title, value, icon, trend, trendType = 'neutral' }: StatsCardProps) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trendColors[trendType]} flex items-center mt-1`}>
            {trendType === 'up' ? '↑' : trendType === 'down' ? '↓' : '→'} {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default function AdminDashboardPage() {
  const { data: submissions = [], isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['submissions'],
    queryFn: submissionService.getSubmissions,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // In a real app, this would be an API call to get all users
      await new Promise(resolve => setTimeout(resolve, 300));
      return [
        { id: '1', name: 'Sarah Johnson', role: 'teacher', email: 'sarah@example.com' },
        { id: '2', name: 'Michael Chen', role: 'teacher', email: 'michael@example.com' },
        { id: '3', name: 'Admin User', role: 'admin', email: 'admin@example.com' },
      ];
    },
  });

  if (isLoadingSubmissions) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const printedSubmissions = submissions.filter(sub => sub.status === 'printed');
  const censoredSubmissions = submissions.filter(sub => sub.status === 'censored');
  const teachers = users.filter(user => user.role === 'teacher');

  const stats = [
    {
      title: 'Total Submissions',
      value: submissions.length,
      icon: <FileText className="h-4 w-4 text-primary" />,
      trend: `${submissions.length} total`,
    },
    {
      title: 'Total Teachers',
      value: teachers.length,
      icon: <Users className="h-4 w-4 text-blue-500" />,
      trend: `${teachers.length} active`,
    },
    {
      title: 'Pending Review',
      value: pendingSubmissions.length,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      trend: `${pendingSubmissions.length} pending`,
      trendType: pendingSubmissions.length > 0 ? 'down' : 'neutral'
    },
    {
      title: 'Completed',
      value: printedSubmissions.length,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      trend: `${printedSubmissions.length} completed`,
      trendType: 'up'
    },
  ];

  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const teacherActivity = teachers.map(teacher => ({
    name: teacher.name,
    submissions: submissions.filter(s => s.teacherId === teacher.id).length,
    lastActive: new Date().toISOString() // In a real app, this would come from user activity logs
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendType={stat.trendType}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div key={submission.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{submission.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.teacherName} • {submission.grade}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          submission.status === 'pending' 
                            ? 'bg-amber-100 text-amber-800' 
                            : submission.status === 'censored'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {submission.status === 'pending' 
                            ? 'Pending' 
                            : submission.status === 'censored'
                            ? 'In Review'
                            : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent submissions</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Teacher Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {teacherActivity.length > 0 ? (
              <div className="space-y-4">
                {teacherActivity.map((teacher, index) => (
                  <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {teacher.submissions} submissions
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Active today
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No teacher activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
