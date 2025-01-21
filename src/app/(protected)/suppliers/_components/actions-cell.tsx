"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Supplier } from "@/types/supplier.type";
import { useSupplierMutations } from "../hooks/useSuppliersMutation";
import { EditSupplierForm } from "./edit-supplier-form";

interface ActionsCellProps {
  row: Supplier;
}

const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { deleteSupplierAsync } = useSupplierMutations();
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
  };

  const handleDeleteSupplier = async () => {
    if (supplierToDelete) {
      try {
        await deleteSupplierAsync({ supplierId: supplierToDelete.id });
        setSupplierToDelete(null);
      } catch (error) {
        console.error("Failed to delete supplier:", error);
      }
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
            onClick={() => navigator.clipboard.writeText(row.id.toString())}
          >
            Copy supplier ID
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Edit Supplier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSupplierToDelete(row)}>
            Delete Supplier
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          <EditSupplierForm supplier={row} onSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!supplierToDelete}
        onOpenChange={(open) => !open && setSupplierToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this supplier?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              supplier from your management system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSupplier}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionsCell;
