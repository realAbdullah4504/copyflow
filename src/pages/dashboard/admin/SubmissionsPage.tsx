import { PageHeader } from "@/components/common";
import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionTable,
} from "@/components/submissions";
import { useAllSubmissions } from "@/hooks/queries";

const SubmissionPage = () => {
  const { submissions } = useAllSubmissions();


  const columns = getSubmissionColumns(ROLES.ADMIN);
  return (
    <>
      <PageHeader
        title="All Submissions"
        role={ROLES.ADMIN}
      />
      <SubmissionTable data={submissions} columns={columns} />
    </>
  );
};

export default SubmissionPage;
