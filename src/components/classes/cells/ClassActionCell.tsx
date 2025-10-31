import { Button } from "@/components/ui/button";
import { Edit3, Trash2, CheckCircle, XCircle } from "lucide-react";
import type { ClassEntity } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ClassActionCellProps {
  row: ClassEntity;
  onEdit?: (row: ClassEntity) => void;
  onToggle?: (row: ClassEntity) => void;
  onDelete?: (row: ClassEntity) => void;
}

const ClassActionCell = ({
  row,
  onEdit,
  onToggle,
  onDelete,
}: ClassActionCellProps) => {
  const isActive = row.active;

  return (
    <TooltipProvider>
      <div
        className={cn(
          "inline-flex items-center justify-end gap-1.5 rounded-xl border bg-muted/30 px-1 py-0.5 shadow-sm",
          "transition-all duration-200 hover:bg-muted/50"
        )}
      >
        {/* Edit */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-background/60 transition-colors"
              onClick={() => onEdit?.(row)}
            >
              <Edit3 className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Edit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>

        {/* Activate / Deactivate */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 hover:bg-background/60 transition-colors",
                isActive
                  ? "text-emerald-500 hover:text-emerald-600"
                  : "text-amber-500 hover:text-amber-600"
              )}
              onClick={() => onToggle?.(row)}
            >
              {isActive ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isActive ? "Deactivate" : "Activate"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isActive ? "Deactivate" : "Activate"}
          </TooltipContent>
        </Tooltip>

        {/* Delete */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => onDelete?.(row)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ClassActionCell;
