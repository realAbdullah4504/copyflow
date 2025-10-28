import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Archive, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAllSubmissions, useArchivedSubmissions, useCensoredSubmissions } from "@/hooks/queries";

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
const SecretaryPage = () => {
  const { submissions, isLoading: isLoadingSubmissions } = useAllSubmissions();

  const { submissions: censoredSubmissions, isLoading: isLoadingCensored } = useCensoredSubmissions();
  const { submissions: archivedSubmissions, isLoading: isLoadingArchived } = useArchivedSubmissions();

  if (isLoadingSubmissions || isLoadingCensored || isLoadingArchived) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
  const printedSubmissions = submissions.filter(sub => sub.status === 'printed');

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
      title: 'Censored',
      value: censoredSubmissions.length,
      icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      trend: `${censoredSubmissions.length} censored`,
    },
    {
      title: 'Archived',
      value: archivedSubmissions.length,
      icon: <Archive className="h-4 w-4 text-muted-foreground" />,
      trend: `${archivedSubmissions.length} archived`,
    },
    {
      title: 'Completed',
      value: printedSubmissions.length,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      trend: `${printedSubmissions.length} completed`,
      trendType: 'up'
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Secretary Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            <CardTitle className="text-lg font-semibold">Recent Pending Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingSubmissions.length > 0 ? (
              <div className="space-y-4">
                {pendingSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{submission.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.teacherName} • {submission.grade}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                        {submission.urgency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No pending submissions</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Censored Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {censoredSubmissions.length > 0 ? (
              <div className="space-y-4">
                {censoredSubmissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{submission.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.teacherName} • {submission.grade}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                        Censored
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No censored submissions</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecretaryPage;
