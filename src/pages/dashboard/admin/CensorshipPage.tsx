import { PageHeader } from "@/components/common";
import {
  getCensorshipColumns,
  SubmissionTable,
} from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useCensoredSubmissions } from "@/hooks/queries";

export default function AdminCensorshipPage() {
  const { submissions } = useCensoredSubmissions();
  const columns = getCensorshipColumns(ROLES.ADMIN);

  return (
    <>
      <PageHeader title="Censorship Queue" role={ROLES.ADMIN} />
      <SubmissionTable data={submissions} columns={columns} />
    </>
  );
}
