import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface ActionsDropdownMenuProps {
  onUpdateRole: () => void;
  onResetPassword: () => void;
}

export const ActionsDropdownMenu = ({
  onUpdateRole,
  onResetPassword,
}: ActionsDropdownMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem onClick={onUpdateRole}>Update Role</DropdownMenuItem>
      <DropdownMenuItem onClick={onResetPassword}>
        Reset Password
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
