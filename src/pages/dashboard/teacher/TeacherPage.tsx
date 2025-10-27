import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Archive, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { submissionService } from "@/services/submissionService";
import { useAuth } from "@/hooks/useAuth";

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

const TeacherPage = () => {
  const { user } = useAuth();
  const teacherId = user?.id || '';

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions', 'teacher', teacherId],
    queryFn: () => submissionService.getSubmissionsByTeacher(teacherId),
    enabled: !!teacherId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const printedSubmissions = submissions.filter(sub => sub.status === 'printed');
  const censoredSubmissions = submissions.filter(sub => sub.status === 'censored');

  const stats = [
    {
      title: 'Total Submissions',
      value: submissions.length,
      icon: <FileText className="h-4 w-4 text-primary" />,
      trend: `${submissions.length} total`,
    },
    {
      title: 'Pending Review',
      value: pendingSubmissions.length,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      trend: `${pendingSubmissions.length} pending`,
      trendType: pendingSubmissions.length > 0 ? 'down' : 'neutral'
    },
    {
      title: 'In Review',
      value: censoredSubmissions.length,
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      trend: `${censoredSubmissions.length} in review`,
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
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

      <div className="grid gap-6">
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
                          {submission.grade} • {new Date(submission.createdAt).toLocaleDateString()}
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
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {submission.urgency}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No submissions yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherPage;
