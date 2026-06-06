import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  FileText,
  Users,
  Clock,
  CheckCircle,
  User,
} from "lucide-react";
import {
  useAllSubmissions,
  useArchivedSubmissions,
  useAuth,
  useCensoredSubmissions,
  useTeachers,
} from "@/hooks";
import type { SubmissionFilters } from "@/types";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
};

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendType = "neutral",
}: StatsCardProps) => {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-gray-500",
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
          <p
            className={`text-xs ${trendColors[trendType]} flex items-center mt-1`}
          >
            {trendType === "up" ? "↑" : trendType === "down" ? "↓" : "→"}{" "}
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default function AdminDashboardPage() {
  const activeTeachers = true;
  const { user } = useAuth();
  const filters: SubmissionFilters = {
    timeFrame: "7d",
  };
  const { submissions, isLoading: isLoadingSubmissions } = useAllSubmissions(
    user!.id,
    {
      filters
    }
  );
  const {
    submissions: archivedSubmissions,
    isLoading: isLoadingArchivedSubmissions,
  } = useArchivedSubmissions(user!.id,{
    filters
  });
  const {
    submissions: censoredSubmissions,
    isLoading: isLoadingCensoredSubmissions,
  } = useCensoredSubmissions(user!.id,{
    filters
  });
  const { teachers, isLoading: isLoadingTeachers } = useTeachers(
    user!.id,
    activeTeachers
  );

  if (
    isLoadingSubmissions ||
    isLoadingTeachers ||
    isLoadingArchivedSubmissions ||
    isLoadingCensoredSubmissions
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Submissions",
      value: submissions.length,
      icon: <FileText className="h-4 w-4 text-primary" />,
      trend: `${submissions.length} total`,
    },
    {
      title: "Total Teachers",
      value: teachers.length,
      icon: <Users className="h-4 w-4 text-blue-500" />,
      trend: `${teachers.length} active`,
    },
    {
      title: "Pending Review",
      value: censoredSubmissions.length,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      trend: `${censoredSubmissions.length} pending`,
      trendType: censoredSubmissions.length > 0 ? "down" as const : "neutral" as const,
    },
    {
      title: "Completed",
      value: archivedSubmissions.length,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      trend: `${archivedSubmissions.length} completed`,
      trendType: archivedSubmissions.length > 0 ? "up" as const : "neutral" as const,
    },
  ];

  const recentSubmissions = [...submissions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const teacherActivity = teachers.map((teacher) => ({
    name: teacher.name,
    submissions: submissions.filter((s) => s.teacherId === teacher.id).length,
    lastActive: new Date().toISOString(), // In a real app, this would come from user activity logs
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Showing data from the last 7 days</p>
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
            <CardTitle className="text-lg font-semibold">
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length > 0 ? (
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{submission.class?.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.teacher?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            submission.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : submission.status === "censored"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {submission.status === "pending"
                            ? "Pending"
                            : submission.status === "censored"
                            ? "In Review"
                            : "Completed"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No recent submissions
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Teacher Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teacherActivity.length > 0 ? (
              <div className="space-y-4">
                {teacherActivity.map((teacher, index) => (
                  <div
                    key={index}
                    className="border-b pb-3 last:border-0 last:pb-0"
                  >
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
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No teacher activity
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
