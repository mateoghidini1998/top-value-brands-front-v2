"use client";

import { useState } from "react";
import type { GetUsersData } from "@/types/auth.type";
import { ActionsDropdownMenu } from "../features/actions-dropdown-menu.component";
import { UpdateRoleDialog } from "../features/update-role-dialog.component";
import { ResetPasswordDialog } from "../features/reset-password-dialog.component";

interface ActionsCellProps {
  row: GetUsersData;
}

export const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  return (
    <>
      <ActionsDropdownMenu
        onUpdateRole={() => setIsRoleDialogOpen(true)}
        onResetPassword={() => setIsPasswordDialogOpen(true)}
      />

      <UpdateRoleDialog
        isOpen={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        userId={row.id}
        initialRole={row.role}
      />

      <ResetPasswordDialog
        isOpen={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        userId={row.id}
      />
    </>
  );
};
