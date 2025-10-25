import { SUBMISSION_COLUMNS, SubmissionTable } from "@/components/submissions";
import { useSubmissions } from "@/hooks/useSubmissions";
import { PageHeader } from "@/components/common";

const AdminSubmissionsPage = () => {
  const { submissions, isLoading } = useSubmissions();
  const columns = SUBMISSION_COLUMNS.ADMIN;
  return (
    <div>
      <PageHeader title="Submissions" />
      <SubmissionTable
        data={submissions}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminSubmissionsPage;
