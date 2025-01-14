"use client";

import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { columns } from "./columns";
import { useTrackedProducts } from "./hooks";

export default function Page() {
  const { trackedProductsQuery } = useTrackedProducts();

  if (trackedProductsQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!trackedProductsQuery.data) {
    return <div>Error</div>;
  }

  return (
    <div>
      <DataTable
        data={trackedProductsQuery.data.data}
        columns={columns}
        dataLength={50}
      />
    </div>
  );
}
