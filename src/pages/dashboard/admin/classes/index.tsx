import { useParams } from "react-router-dom";
import { PageHeader } from "@/components/common";
import { ROLES } from "@/config/roles";
import {
  useAuth,
  useClassMutations,
  useModal,
  useTeachersByGrade,
} from "@/hooks";
import type { ClassesWithSchedules, GradeLevel } from "@/types";
import {
  ClassesTable,
  ClassModal,
  getClassV2Columns,
} from "@/components/classes";

const AdminClassesPage = () => {
  const { grade } = useParams<{ grade?: GradeLevel }>();
  const { user } = useAuth();
  const { data: teachers = [], isLoading } = useTeachersByGrade(
    grade!,
    user!.id
  );
  const { deleteClass, toggleActive, toggleLoading, deleteLoading } =
    useClassMutations();
  const { modal, openModal, closeModal } = useModal<ClassesWithSchedules>();

  const handleAction = (action: string, row: ClassesWithSchedules) => {
    openModal(action, row);
  };

  const columns = getClassV2Columns({
    onEdit: (row) => handleAction("editClass", row),
    onToggle: (row) => handleAction("toggleActive", row),
    onDelete: (row) => handleAction("deleteClass", row),
  });

  const handleDeleteConfirm = () => {
    if (!modal.data) return;
    deleteClass(modal.data.id, {
      onSuccess: () => {
        closeModal();
      },
    });
  };

  const handleToggleActiveConfirm = () => {
    if (!modal.data) return;
    toggleActive(modal.data.id, {
      onSuccess: () => {
        closeModal();
      },
    });
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Management"
        role={ROLES.TEACHER}
        buttonTitle="New Class"
        sideAction={() => openModal("newClass")}
      />

      <ClassesTable data={teachers} columns={columns} isLoading={isLoading} />
      <ClassModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        grade={grade!}
        adminId={user!.id}
        isSubmitting={toggleLoading || deleteLoading}
        handlers={{
          onDeleteConfirm: handleDeleteConfirm,
          onToggleActiveConfirm: handleToggleActiveConfirm,
        }}
      />
    </div>
  );
};

export default AdminClassesPage;
