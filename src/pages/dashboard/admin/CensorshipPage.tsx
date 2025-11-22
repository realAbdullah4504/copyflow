import { PageHeader } from "@/components/common";
import {
  getCensorshipColumns,
  SubmissionModal,
  SubmissionTable,
} from "@/components/submissions";
import { CENSORSHIP_ALLOWED_ACTIONS, getAllowedActions } from "@/config";
import { ROLES } from "@/config/roles";
import { useCensoredSubmissions, useAuth } from "@/hooks";
import { useModal } from "@/hooks/useModal";
import type { Submission } from "@/types";

export default function AdminCensorshipPage() {
  const { user } = useAuth();
  const { submissions } = useCensoredSubmissions(user!.id);
  const { modal, openModal, closeModal } = useModal<Submission>();

  const handleAction = (action: string, row: Submission) => {
    openModal(action, row);
  };

  const handleRowClick = (row: Submission) => {
    if (allowedActions.includes("view")) {
      openModal("view", row);
    }
  };
  const allowedActions = getAllowedActions(
    CENSORSHIP_ALLOWED_ACTIONS,
    ROLES.ADMIN
  );
  const columns = getCensorshipColumns(
    ROLES.ADMIN,
    allowedActions as string[],
    handleAction
  );

  return (
    <>
      <PageHeader title="Censorship Queue" role={ROLES.ADMIN} />
      <SubmissionTable
        data={submissions}
        columns={columns}
        onRowClick={handleRowClick}
      />
      <SubmissionModal
        data={modal.data}
        type={modal.type}
        open={modal.isOpen}
        onOpenChange={closeModal}
        onClose={closeModal}
      />
    </>
  );
}
