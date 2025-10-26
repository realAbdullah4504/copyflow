import { useState } from "react";
import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionTable,
} from "@/components/submissions";
import { useSubmissions } from "@/hooks/useSubmissions";
import { PageHeader } from "@/components/common";
import { type ActionType } from "@/config";

const AdminSubmissionsPage = () => {
  const { submissions } = useSubmissions();
  const [selectedRow, setSelectedRow] = useState<Submission | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleAction = (action: ActionType, row: Submission) => {
    switch (action) {
      case "view":
        // maybe navigate
        console.log("Viewing", row);
        break;
      case "edit":
        // maybe open an edit modal
        console.log("Editing", row);
        break;
      case "delete":
        setSelectedRow(row);
        setDeleteOpen(true); // OPEN MODAL
        break;
    }
  };

  const columns = getSubmissionColumns(ROLES.ADMIN, handleAction);

  return (
    <>
      <PageHeader title="All Submissions" role={ROLES.ADMIN} onNew={() => {}} />
      <SubmissionTable data={submissions} columns={columns} />
      {deleteOpen && selectedRow && (
        // <DeleteModal
        //   open={deleteOpen}
        //   onConfirm={() => {
        //     console.log("Deleting", selectedRow);
        //     setDeleteOpen(false);
        //   }}
        //   onCancel={() => setDeleteOpen(false)}
        // />
      )}
    </>
  );
};

export default AdminSubmissionsPage;
