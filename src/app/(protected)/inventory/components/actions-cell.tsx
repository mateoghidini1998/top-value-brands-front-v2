"use client";

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
import { useInventory } from "../hooks/useInventory";
import { Product } from "../interfaces/product.interface";
import { EditProductForm } from "./edit-product-form";

interface ActionsCellProps {
  row: Product;
}

const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { deleteProductMutation } = useInventory();

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
  };

  const handleDeleteProduct = async (product: Product) => {
    await deleteProductMutation.mutateAsync(product);
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
            Copy product ID
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Edit Product
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeleteProduct(row)}>
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <EditProductForm product={row} onSuccess={handleEditSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionsCell;
