import { PageHeader } from "@/components/common";
import { ROLES } from "@/config/roles";
import {
  getSubmissionColumns,
  SubmissionTable,
} from "@/components/submissions";
import { useAllSubmissions } from "@/hooks/queries";

const SubmissionPage = () => {
  const { submissions, total, isLoading } = useAllSubmissions();


  const columns = getSubmissionColumns(ROLES.ADMIN);
  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.ADMIN}
      />
      <SubmissionTable
        data={submissions}
        columns={columns}
        isLoading={isLoading}
      />
    </>
  );
};

export default SubmissionPage;
