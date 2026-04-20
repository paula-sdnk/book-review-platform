// review-actions-dropdown.tsx
"use client";

import { EllipsisVertical, Pen, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@book-review-platform/ui/components/dropdown-menu";

type ReviewActionsDropdownProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export function ReviewActionsDropdown({
  onEdit,
  onDelete,
}: ReviewActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-6 cursor-pointer items-center justify-center rounded-lg bg-[#c49a63] p-1 text-white transition hover:bg-[#b48953]">
        <EllipsisVertical />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 rounded-lg border-[#e8d9c5] bg-[#fffaf3] text-[#5c4033]">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onEdit}>
            <Pen />
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
