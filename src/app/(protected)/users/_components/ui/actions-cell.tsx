"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GetUsersData } from "@/types/auth.type";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useUpdateUserRole } from "../../hooks/auth-service.hook";

interface ActionsCellProps {
  row: GetUsersData;
}

const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(row.role);
  const updateUserRole = useUpdateUserRole();

  const handleRoleUpdate = async () => {
    try {
      await updateUserRole.mutateAsync({ userId: row.id, role: selectedRole });
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.id)}
          >
            Copy user ID
          </DropdownMenuItem> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem onClick={() => setIsRoleDialogOpen(true)}>
            Update Role
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={() => alert(`View details for ${row.username}`)}
          >
            View Details
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
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
    </>
  );
};

export default ActionsCell;
