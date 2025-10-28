"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Submission } from "@/types";
import { getActionMeta, type ActionKey, type GenericActionConfig } from "../actions/shared";

interface ActionCellProps<T extends GenericActionConfig> {
  actions: ActionKey<T>[]; // Allowed actions for the given role/context
  actionsConfig: T; // The config for this table type (submission, archive, etc.)
  rowData: Submission;
  onAction: (action: ActionKey<T>, row: Submission) => void;
}

const ActionCell: React.FC<ActionCellProps<GenericActionConfig>> = ({
  actions,
  actionsConfig,
  rowData,
  onAction,
}) => {
  const [open, setOpen] = useState(false);

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
          const { icon: Icon, label } = getActionMeta(actionsConfig, action);
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
