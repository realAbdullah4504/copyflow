import { ROLES } from "@/config/roles";
import { useClassesByTeacher, useAuth } from "@/hooks";
import { ClassesTable, getClassColumns } from "@/components/classes";
import { PageHeader } from "@/components/common";

const ClassesPage = () => {
  const { user } = useAuth();
  const { classes, isLoading } = useClassesByTeacher(user?.id || "");

  const columns = getClassColumns();

  return (
    <>
      <PageHeader title="My Classes" role={ROLES.TEACHER} />

      <ClassesTable data={classes} columns={columns} isLoading={isLoading} />
    </>
  );
};

export default ClassesPage;
