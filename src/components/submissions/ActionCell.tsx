"use client";

import { useState } from "react";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Role } from "@/config/roles";
import type { Submission } from "@/types";
import { ACTION_CONFIG, ALLOWED_ACTIONS, type ActionType } from "@/config/actions";

interface ActionCellProps {
  role: Role;
  rowData: Submission;
  onAction: (action: ActionType, row: Submission) => void;
}

const ActionCell: React.FC<ActionCellProps> = ({ role, rowData, onAction }) => {
  const [open, setOpen] = useState(false);
  const actions = ALLOWED_ACTIONS[role];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {actions.map((action) => {
          const Icon = ACTION_CONFIG[action].icon;
          const label = ACTION_CONFIG[action].label;
          const danger = action === "delete";

          return (
            <DropdownMenuItem
              key={action}
              onClick={() => {
                setOpen(false);
                onAction(action, rowData);
              }}
              className={danger ? "text-red-600" : ""}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCell;
