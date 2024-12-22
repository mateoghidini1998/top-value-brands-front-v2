"use client";

import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useTrackedProducts } from "../../inventory/tracked-products/hooks/useTrackedProducts";
import { useOrders } from "../hooks/useOrders";
import { getAddedProductsColumns, getTrackedProductsColumns } from "./columns";
import { ProductInOrder } from "./interface/product-added.interface";

export default function Page() {
  const { trackedProductsQuery } = useTrackedProducts();
  const { createOrderMutation } = useOrders();

  const [productsAdded, setProductsAdded] = useState<ProductInOrder[]>([]);

  if (trackedProductsQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!trackedProductsQuery.data) {
    return <div>Error</div>;
  }

  const handleCreateOrder = async (productsAdded: ProductInOrder[]) => {
    if (productsAdded.length === 0) {
      toast.error("No products added");
      return;
    }

    await createOrderMutation.mutateAsync({
      products: productsAdded.map((product) => {
        return {
          product_id: product.product_id,
          quantity: product.quantity,
          unit_price: 10,
        };
      }),
      order_number: "123456",
      supplier_id: 1,
      purchase_order_status_id: 1,
    });
  };

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
      <Button
        onClick={() => {
          handleCreateOrder(productsAdded);
        }}
      >
        Create Order
      </Button>
    </>
  );
}
