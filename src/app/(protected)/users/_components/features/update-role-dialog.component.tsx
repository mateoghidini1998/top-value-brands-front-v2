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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUserRole } from "../../hooks/use-auth-service.hook";
import { UserCog, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UpdateRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialRole: string;
  userName: string;
}

export const UpdateRoleDialog = ({
  isOpen,
  onOpenChange,
  userId,
  initialRole,
  userName,
}: UpdateRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const updateUserRole = useUpdateUserRole();
  const [updateStatus, setUpdateStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(initialRole);
      setUpdateStatus("idle");
    }
  }, [isOpen, initialRole]);

  const handleRoleUpdate = async () => {
    try {
      await updateUserRole.mutateAsync({ userId, role: selectedRole });
      setUpdateStatus("success");
      setTimeout(() => onOpenChange(false), 2000);
    } catch (error) {
      console.error("Failed to update user role:", error);
      setUpdateStatus("error");
    }
  };

  const roles = [
    { value: "warehouse", label: "Warehouse" },
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "support", label: "Support" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Update User Role
          </DialogTitle>
          <DialogDescription>
            Change the role for user: {userName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="role" className="text-left">
              Select New Role
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {updateStatus === "success" && (
            <Alert variant="default">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                User role has been updated successfully.
              </AlertDescription>
            </Alert>
          )}
          {updateStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to update user role. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleRoleUpdate}
            disabled={updateUserRole.isPending || selectedRole === initialRole}
            className="w-full sm:w-auto"
          >
            {updateUserRole.isPending ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
