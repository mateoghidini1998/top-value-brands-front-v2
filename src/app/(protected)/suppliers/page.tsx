"use client";

import { CreateEntityButton } from "@/components/custom/create-entity-button";
import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { CreateSupplierForm } from "./_components";
import { columns } from "./columns";
import { useSuppliers } from "./hooks";

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
      <CreateEntityButton
        title="Create Supplier"
        dialog_content={<CreateSupplierForm />}
        dialog_title="Create New Supplier"
      />
      <DataTable
        columns={columns}
        data={suppliersQuery.data.data}
        dataLength={10000}
      />
    </div>
  );
}
