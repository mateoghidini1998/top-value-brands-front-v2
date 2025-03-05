"use client";

import { useState, useEffect } from "react";
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
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { changePassword, isChangingPassword } = useChangeUserPassword();

  useEffect(() => {
    setPasswordsMatch(newPassword === repeatNewPassword);
  }, [newPassword, repeatNewPassword]);

  const handlePasswordChange = async () => {
    if (newPassword !== repeatNewPassword) {
      setPasswordsMatch(false);
      return;
    }

    try {
      await changePassword.mutateAsync({
        userId,
        currentPassword,
        newPassword,
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "repeat") => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "repeat":
        setShowRepeatNewPassword(!showRepeatNewPassword);
        break;
    }
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setRepeatNewPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowRepeatNewPassword(false);
    setPasswordsMatch(true);
  };

  const isFormValid =
    currentPassword && newPassword && repeatNewPassword && passwordsMatch;

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
          <PasswordInput
            id="currentPassword"
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            showPassword={showCurrentPassword}
            toggleVisibility={() => togglePasswordVisibility("current")}
          />
          <PasswordInput
            id="newPassword"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            showPassword={showNewPassword}
            toggleVisibility={() => togglePasswordVisibility("new")}
          />
          <PasswordInput
            id="repeatNewPassword"
            label="Repeat New Password"
            value={repeatNewPassword}
            onChange={setRepeatNewPassword}
            showPassword={showRepeatNewPassword}
            toggleVisibility={() => togglePasswordVisibility("repeat")}
          />
        </div>
        {!passwordsMatch && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              New passwords do not match. Please try again.
            </AlertDescription>
          </Alert>
        )}
        {/* {passwordChangeError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{passwordChangeError?.message || "An error occurred while changing the password."}</AlertDescription>
          </Alert>
        )} */}
        <DialogFooter>
          <Button
            type="submit"
            onClick={handlePasswordChange}
            disabled={isChangingPassword || !isFormValid}
            className="w-full sm:w-auto"
          >
            {isChangingPassword ? "Changing..." : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  toggleVisibility: () => void;
}

const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  showPassword,
  toggleVisibility,
}: PasswordInputProps) => (
  <div className="grid gap-2">
    <Label htmlFor={id} className="text-left">
      {label}
    </Label>
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        className="pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2"
        onClick={toggleVisibility}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  </div>
);
