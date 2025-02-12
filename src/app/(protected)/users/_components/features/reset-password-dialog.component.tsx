"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChangeUserPassword } from "../../hooks/use-auth-service.hook";
import { Eye, EyeOff, Lock } from "lucide-react";

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
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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

  const togglePasswordVisibility = (field: "current" | "new") => {
    if (field === "current") {
      setShowCurrentPassword(!showCurrentPassword);
    } else {
      setShowNewPassword(!showNewPassword);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Reset Password
          </DialogTitle>
          <DialogDescription>
            Enter your current password and a new password to reset.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="currentPassword" className="text-left">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                className="pr-10"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword" className="text-left">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                className="pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {passwordChangeError && (
          <p className="text-destructive text-sm">
            {passwordChangeError.message}
          </p>
        )}
        <DialogFooter>
          <Button
            type="submit"
            onClick={handlePasswordChange}
            disabled={isChangingPassword || !currentPassword || !newPassword}
            className="w-full sm:w-auto"
          >
            {isChangingPassword ? "Changing..." : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
