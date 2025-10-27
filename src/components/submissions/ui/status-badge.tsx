import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/types";
import { cn } from "@/utils";

interface StatusBadgeProps {
  status: SubmissionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: {
      label: "Pending",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    printed: {
      label: "Printed",
      className: "bg-slate-100 text-slate-800 hover:bg-slate-100",
    },
    censored: {
      label: "In Review",
      className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    },
    archived: {
      label: "Archived",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
  };

  const { label, className } = config[status];

  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {label}
    </Badge>
  );
}
