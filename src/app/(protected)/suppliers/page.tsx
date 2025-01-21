"use client";

import { DataTable } from "@/components/custom/data-table";
import { useSuppliers } from "./hooks";
import { columns } from "./columns";

export default function Page() {
  const { suppliersQuery } = useSuppliers();

  if (suppliersQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (suppliersQuery.isError) {
    return <div>Error</div>;
  }

  if (!suppliersQuery.data) {
    return <div>No data</div>;
  }

  return (
    <div>
      <h1>Suppliers</h1>
      <DataTable
        columns={columns}
        data={suppliersQuery.data.data}
        dataLength={50}
      />
    </div>
  );
}
