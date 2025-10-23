import { DataTable } from "@/components/common";
import { useSubmissions } from "@/hooks/useSubmissions";
import { SUBMISSION_COLUMNS } from "./columns/columnsDef";
const RecentSubmissions = () => {
  const { submissions, isLoading: submissionsLoading } = useSubmissions();
  const columns = SUBMISSION_COLUMNS.ADMIN;
  const recentSubmissions = [...submissions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
  return (
    <DataTable
      data={recentSubmissions}
      isLoading={submissionsLoading}
      columns={columns}
      maxRows={5}
      title="Recent Submissions"
    />
  );
};

export default RecentSubmissions;
