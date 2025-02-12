"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChangeUserPassword } from "../../hooks/use-auth-service.hook";

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export const ResetPasswordDialog = ({
  isOpen,
  onOpenChange,
  userId,
}: ResetPasswordDialogProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { changePassword, isChangingPassword, passwordChangeError } =
    useChangeUserPassword();

  const handlePasswordChange = async () => {
    try {
      await changePassword.mutateAsync({
        userId,
        currentPassword,
        newPassword,
      });
      onOpenChange(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentPassword" className="text-right">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              className="col-span-3"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              className="col-span-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        {passwordChangeError && (
          <p className="text-red-500 text-sm">{passwordChangeError.message}</p>
        )}
        <DialogFooter>
          <Button
            type="submit"
            onClick={handlePasswordChange}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? "Changing..." : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
