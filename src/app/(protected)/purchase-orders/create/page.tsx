"use client";

import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { useState } from "react";
import { useTrackedProducts } from "../../inventory/tracked-products/hooks/useTrackedProducts";
import { ProductInOrder } from "./interface/product-added.interface";
import { getAddedProductsColumns, getTrackedProductsColumns } from "./columns";

export default function Page() {
  const { trackedProductsQuery } = useTrackedProducts();

  const [productsAdded, setProductsAdded] = useState<ProductInOrder[]>([]);

  if (trackedProductsQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!trackedProductsQuery.data) {
    return <div>Error</div>;
  }

  return (
    <>
      <div className="max-h-[400px] overflow-y-auto">
        <DataTable
          data={trackedProductsQuery.data.data}
          columns={getTrackedProductsColumns(setProductsAdded)}
          dataLength={10}
        />
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        <DataTable
          data={productsAdded}
          columns={getAddedProductsColumns(setProductsAdded)}
          dataLength={10}
        />
      </div>
    </>
  );
}
