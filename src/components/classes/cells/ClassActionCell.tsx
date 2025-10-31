import { Button } from "@/components/ui/button";
import type { ClassEntity } from "@/types";

interface ClassActionCellProps {
  row: ClassEntity;
  onEdit?: (row: ClassEntity) => void;
  onToggle?: (row: ClassEntity) => void;
  onDelete?: (row: ClassEntity) => void;
}

const ClassActionCell = ({ row, onEdit, onToggle, onDelete }: ClassActionCellProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary" onClick={() => onEdit?.(row)}>Edit</Button>
      <Button size="sm" variant={row.active ? "outline" : "default"} onClick={() => onToggle?.(row)}>
        {row.active ? "Deactivate" : "Activate"}
      </Button>
      <Button size="sm" variant="destructive" onClick={() => onDelete?.(row)}>Delete</Button>
    </div>
  );
};

export default ClassActionCell;
