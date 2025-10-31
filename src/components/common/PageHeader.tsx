import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canCreate, type Role } from "@/config";

interface PageHeaderProps {
  title: string;
  role: Role;
  buttonTitle?: string;
  sideAction?: () => void;
}

const PageHeader = ({ title, role, buttonTitle, sideAction }: PageHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
    {canCreate(role) && sideAction ? (
      <Button onClick={sideAction}>
        <Plus className="mr-2 h-4 w-4" />
        {buttonTitle}
      </Button>
    ) : null}
  </div>
);

export default PageHeader;
