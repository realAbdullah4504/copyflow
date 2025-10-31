import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/config/roles";
import { useClassesByTeacher } from "@/hooks/queries";
import { useClassMutations } from "@/hooks/mutations";
import { useModal } from "@/hooks/useModal";
import type { ClassEntity } from "@/types";
import {
  ClassesTable,
  ClassModal,
  getClassColumns,
} from "@/components/classes";
import { PageHeader } from "@/components/common";

const ClassesPage = () => {
  const { user } = useAuth();
  const { classes, isLoading } = useClassesByTeacher(user?.id || "");
  const { deleteClass, toggleActive } = useClassMutations();
  const { modal, openModal, closeModal } = useModal<ClassEntity>();

  const handleAction = (action: string, row: ClassEntity) => {
    openModal(action, row);
  };

  const columns = getClassColumns({
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
    <>
      <PageHeader
        title="My Classes"
        role={ROLES.TEACHER}
        buttonTitle="New Class"
        sideAction={() => openModal("newClass")}
      />

      <ClassesTable data={classes} columns={columns} isLoading={isLoading} />

      <ClassModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
        handlers={{
          onDeleteConfirm: handleDeleteConfirm,
          onToggleActiveConfirm: handleToggleActiveConfirm,
        }}
      />
    </>
  );
};

export default ClassesPage;
