"use client";

import { DataTable } from "@/components/custom/data-table";
import { useSuppliers } from "./hooks";
import { columns } from "./columns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { CreateSupplierForm } from "./_components";
import LoadingSpinner from "@/components/custom/loading-spinner";

export default function Page() {
  const { suppliersQuery } = useSuppliers();

  if (suppliersQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (suppliersQuery.isError) {
    return <div>Error</div>;
  }

  if (!suppliersQuery.data) {
    return <div>No data</div>;
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-fit h-7 ">
            <Plus className="mr-2 h-4 w-4" />
            Create Supplier
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <DialogTitle>Create New Supplier</DialogTitle>
          </AlertDialogHeader>
          <CreateSupplierForm />
        </DialogContent>
      </Dialog>
      <DataTable
        columns={columns}
        data={suppliersQuery.data.data}
        dataLength={50}
      />
    </div>
  );
}
