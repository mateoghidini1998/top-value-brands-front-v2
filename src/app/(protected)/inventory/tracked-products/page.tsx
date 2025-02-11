"use client";

import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { columns } from "./columns";
import { useGetTrackedProducts } from "./hooks";

export default function Page() {
  const { trackedProductsResponse, trackedProductsIsLoading } =
    useGetTrackedProducts({
      page: 1,
      limit: 50,
    });

  if (trackedProductsIsLoading) {
    return <LoadingSpinner />;
  }

  if (!trackedProductsResponse) {
    return <div>Error</div>;
  }

  return (
    <div>
      <DataTable
        data={trackedProductsResponse.data}
        columns={columns}
        dataLength={50}
      />
    </div>
  );
}
