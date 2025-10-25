import { SubmissionTable } from "@/components/submissions";
import { useSubmissions } from "@/hooks/useSubmissions";
import { SUBMISSION_COLUMNS } from "@/components/submissions/columns/columnsDef";

const AdminSubmissionsPage = () => {
  const { submissions, isLoading } = useSubmissions();
  const columns = SUBMISSION_COLUMNS.ADMIN;
  return (
    <div>
      <SubmissionTable
        data={submissions}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminSubmissionsPage;
