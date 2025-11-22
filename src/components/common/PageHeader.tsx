import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canCreate, type Role } from "@/config";

interface PageHeaderProps {
  title: string;
  role: Role;
  description?: string;
  buttonTitle?: string;
  sideAction?: () => void;
}

const PageHeader = ({ title, role, description, buttonTitle, sideAction }: PageHeaderProps) => (
  <div className="flex flex-col space-y-2 mb-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {canCreate(role) && sideAction && buttonTitle && (
        <Button onClick={sideAction}>
          <Plus className="mr-2 h-4 w-4" />
          {buttonTitle}
        </Button>
      )}
    </div>
    {description && (
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    )}
  </div>
);

export default PageHeader;
