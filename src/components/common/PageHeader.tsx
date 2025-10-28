import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canCreate } from "../submissions";
import type { Role } from "@/config";

interface PageHeaderProps {
  title: string;
  role: Role;
  onNew?: () => void;
}

const PageHeader = ({ title, role, onNew }: PageHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
    {canCreate(role) && (
      <Button onClick={onNew}>
        <Plus className="mr-2 h-4 w-4" />
        New Submission
      </Button>
    )}
  </div>
);

export default PageHeader;
