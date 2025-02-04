import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AlertDialogHeader } from "../ui/alert-dialog";

interface CreateEntityButtonProps {
  title: string;
  dialog_content: React.ReactNode;
  dialog_title: string;
}

export const CreateEntityButton = ({
  title,
  dialog_content,
  dialog_title,
}: CreateEntityButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit h-7 ">
          <Plus className="mr-2 h-4 w-4" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <DialogTitle>{dialog_title}</DialogTitle>
        </AlertDialogHeader>
        {dialog_content}
      </DialogContent>
    </Dialog>
  );
};
