"use client";

import { useOrderSummaryQuery } from "@/app/(protected)/purchase-orders/[orderId]/hooks";
import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PurchaseOrderSummaryProducts } from "@/types";
import { useState, useMemo } from "react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { useIncomingShipmentsMutations } from "../hooks/useIncomingShipmentsMutation";

export default function Page({
  params,
}: {
  params: {
    orderId: string;
  };
}) {
  const { data, isLoading, error } = useOrderSummaryQuery(params.orderId);
  const [localChanges, setLocalChanges] = useState<
    Record<string, Partial<PurchaseOrderSummaryProducts>>
  >({});

  const { updateIncomingOrderProducts } = useIncomingShipmentsMutations(
    params.orderId
  );

  // Combinar datos originales con cambios locales
  const tableData = useMemo(() => {
    if (!data?.data.purchaseOrderProducts) return [];

    return data.data.purchaseOrderProducts.map((product) => ({
      ...product,
      ...localChanges[product.id],
    }));
  }, [data?.data.purchaseOrderProducts, localChanges]);

  const handleQuantityReceivedChange = (rowId: string, value: number) => {
    setLocalChanges((prev) => {
      const quantity_missing =
        (data?.data.purchaseOrderProducts.find((p) => p.id === Number(rowId))
          ?.quantity_purchased || 0) - value;

      return {
        ...prev,
        [rowId]: {
          ...prev[rowId],
          quantity_received: value,
          quantity_missing: quantity_missing >= 0 ? quantity_missing : 0,
          reason_id: quantity_missing === 0 ? 1 : prev[rowId]?.reason_id,
        },
      };
    });
  };

  const handleReasonChange = (rowId: string, value: number) => {
    setLocalChanges((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        reason_id: value,
      },
    }));
  };

  const handleUpcChange = (rowId: string, value: string) => {
    setLocalChanges((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        upc: value,
      },
    }));
  };

  const handleExpireDateChange = (rowId: string, value: Date | undefined) => {
    setLocalChanges((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        expire_date: value ? value.toISOString() : null,
      },
    }));
  };

  const handleSave = () => {
    const updatedProducts = tableData.map((product) => ({
      purchase_order_product_id: product.purchase_order_product_id,
      product_id: product.id,
      quantity_received: product.quantity_received,
      quantity_missing: product.quantity_missing,
      reason_id: product.reason_id,
      upc: product.upc,
      expire_date: product.expire_date,
    }));

    updateIncomingOrderProducts({
      orderId: Number(params.orderId),
      incomingOrderProductUpdates: updatedProducts,
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading purchase order: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || !tableData.length) return null;

  return (
    <div className="py-6 space-y-8">
      <p>Purchase order {params.orderId}</p>
      <Button onClick={() => handleSave()}>Save</Button>
      <DataTable
        columns={columns(
          handleQuantityReceivedChange,
          handleReasonChange,
          handleUpcChange,
          handleExpireDateChange
        )}
        data={tableData}
        dataLength={tableData.length}
      />
    </div>
  );
}
