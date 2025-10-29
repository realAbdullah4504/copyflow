import { PageHeader } from "@/components/common";
import {
  getArchiveColumns,
  SubmissionTable,
} from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useArchivedSubmissions } from "@/hooks/queries";
export default function AdminArchivePage() {
  const { submissions } = useArchivedSubmissions();
  const columns = getArchiveColumns(ROLES.ADMIN);
  return (
    <>
      <PageHeader title="Archive Submissions" role={ROLES.ADMIN} />
      <SubmissionTable data={submissions} columns={columns} />
    </>
  );
}
