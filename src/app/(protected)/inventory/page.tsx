"use client";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { DataTable } from "../../../components/custom/data-table";
import { columns } from "./columns";
import { CreateProductForm } from "./components/create-product-form";
import { useInventory } from "./hooks/useInventory";

export default function Page() {
  const { inventoryQuery } = useInventory();

  if (inventoryQuery.isLoading || inventoryQuery.isFetching) {
    return <LoadingSpinner />;
  }

  if (!inventoryQuery.data) {
    return <div>Error</div>;
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <CreateProductForm />
        </DialogContent>
      </Dialog>

      <DataTable
        data={inventoryQuery.data.data}
        columns={columns}
        dataLength={50}
      />
    </div>
  );
}
