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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUserRole } from "../../hooks/use-auth-service.hook";

interface UpdateRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialRole: string;
}

export const UpdateRoleDialog = ({
  isOpen,
  onOpenChange,
  userId,
  initialRole,
}: UpdateRoleDialogProps) => {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const updateUserRole = useUpdateUserRole();

  const handleRoleUpdate = async () => {
    try {
      await updateUserRole.mutateAsync({ userId, role: selectedRole });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update User Role</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                {/* Add more roles as needed */}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleRoleUpdate}
            disabled={updateUserRole.isPending}
          >
            {updateUserRole.isPending ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
