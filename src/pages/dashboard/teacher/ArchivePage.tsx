import { PageHeader } from "@/components/common";
import {
  getArchiveColumns,
  SubmissionTable,
} from "@/components/submissions";
import { ROLES } from "@/config/roles";
import { useArchiveSubmissionsByTeacher } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
export default function TeacherArchivePage() {
  const { user } = useAuth();
  const { submissions } = useArchiveSubmissionsByTeacher(user?.id || "");
  const columns = getArchiveColumns(ROLES.TEACHER);
  return (
    <>
      <PageHeader title="Archive Submissions" role={ROLES.TEACHER} />
      <SubmissionTable data={submissions} columns={columns} />
    </>
  );
}
