import { useState } from "react";
import { ROLES } from "@/config/roles";
import type { Submission } from "@/types";
import {
  getSubmissionColumns,
  SubmissionTable,
} from "@/components/submissions";
import { useSubmissions } from "@/hooks/useSubmissions";
import { PageHeader } from "@/components/common";

const AdminSubmissionsPage = () => {
  const { submissions } = useSubmissions();
  const [selectedRow, setSelectedRow] = useState<Submission | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleAction = (action: string, row: Submission) => {
    if (action === "view") {
      console.log("Viewing", row);
    } else if (action === "edit") {
      console.log("Editing", row);
    } else if (action === "delete") {
      setSelectedRow(row);
      setDeleteOpen(true);
    }
  };

  const columns = getSubmissionColumns(ROLES.ADMIN, handleAction);

  return (
    <>
      <PageHeader title="All Submissions" />
      <SubmissionTable data={submissions} columns={columns} />
      {/* {deleteOpen && selectedRow && (
        <DeleteModal
          open={deleteOpen}
          onConfirm={() => {
            console.log("Deleting", selectedRow);
            setDeleteOpen(false);
          }}
          onCancel={() => setDeleteOpen(false)}
        />
      )} */}
    </>
  );
};

export default AdminSubmissionsPage;
