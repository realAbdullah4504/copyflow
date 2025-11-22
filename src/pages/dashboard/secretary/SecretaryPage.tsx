import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  FileText,
  Archive,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  useAllSubmissions,
  useArchivedSubmissions,
  useAuth,
  useCensoredSubmissions,
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
const SecretaryPage = () => {
  const { user } = useAuth();
  const adminId = user?.adminId;
  const filters: SubmissionFilters = {
    timeFrame: "7d",
  };
  const { submissions, isLoading: isLoadingSubmissions } = useAllSubmissions(
    adminId!,
    {
      filters,
    }
  );

  const { submissions: censoredSubmissions, isLoading: isLoadingCensored } =
    useCensoredSubmissions(adminId!, {
      filters,
    });
  const { submissions: archivedSubmissions, isLoading: isLoadingArchived } =
    useArchivedSubmissions(adminId!, {
      filters,
    });

  if (isLoadingSubmissions || isLoadingCensored || isLoadingArchived) {
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
      title: "Pending Review",
      value: censoredSubmissions.length,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      trend: `${censoredSubmissions.length} pending`,
      trendType: censoredSubmissions.length > 0 ? "down" : "neutral",
    },
    {
      title: "Completed",
      value: archivedSubmissions.length,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      trend: `${archivedSubmissions.length} completed`,
      trendType: "up",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Secretary Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Showing data from the last 7 days</p>
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
            <CardTitle className="text-lg font-semibold">
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.slice(0, 5).map((submission) => (
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
                      <span
                        className={`text-xs px-2 py-1 ${
                          submission.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : submission.status === "censored"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        } rounded-full`}
                      >
                        {submission.status.charAt(0).toUpperCase() +
                          submission.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No submissions
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Censored Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {censoredSubmissions.length > 0 ? (
              <div className="space-y-4">
                {censoredSubmissions.slice(0, 5).map((submission) => (
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
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                        {submission.status.charAt(0).toUpperCase() +
                          submission.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No censored submissions
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecretaryPage;
