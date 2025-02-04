"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ListUsers } from "./_components/features/list-users.component";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { RegisterForm } from "./_components/features/create-user.component";

/**
 * Page component responsible for displaying the users page.
 * @returns {JSX.Element} The JSX element representing the users page.
 */

export default function Page(): JSX.Element {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-fit h-7 ">
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </AlertDialogHeader>
          <RegisterForm />
        </DialogContent>
      </Dialog>
      <ListUsers />
    </div>
  );
}
