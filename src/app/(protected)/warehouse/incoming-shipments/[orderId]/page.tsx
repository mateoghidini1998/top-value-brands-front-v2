"use client";

import { useOrderSummaryQuery } from "@/app/(protected)/purchase-orders/[orderId]/hooks";
import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PurchaseOrderSummaryProducts } from "@/types";
import { useState } from "react";
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
  const [tableData, setTableData] = useState<PurchaseOrderSummaryProducts[]>(
    data?.data.purchaseOrderProducts || []
  );

  const { updateIncomingOrderProducts } = useIncomingShipmentsMutations(
    params.orderId
  );

  const handleQuantityReceivedChange = (rowId: string, value: number) => {
    setTableData((prevData) =>
      prevData.map((row) => {
        if (row.id === Number(rowId)) {
          const quantity_missing = row.quantity_purchased - value;
          return {
            ...row,
            quantity_received: value,
            quantity_missing: quantity_missing >= 0 ? quantity_missing : 0,
            reason_id: quantity_missing === 0 ? 1 : row.reason_id,
          };
        }
        return row;
      })
    );
  };

  const handleReasonChange = (rowId: string, value: number) => {
    setTableData((prevData) =>
      prevData.map((row) => {
        if (row.id === Number(rowId)) {
          return {
            ...row,
            reason_id: value,
          };
        }
        return row;
      })
    );
  };

  const handleUpcChange = (rowId: string, value: string) => {
    setTableData((prevData) =>
      prevData.map((row) => {
        if (row.id === Number(rowId)) {
          return {
            ...row,
            upc: value,
          };
        }
        return row;
      })
    );
  };

  const handleExpireDateChange = (rowId: string, value: Date | undefined) => {
    setTableData((prevData) =>
      prevData.map((row) => {
        if (row.id === Number(rowId)) {
          return {
            ...row,
            expire_date: value ? value.toISOString() : null,
          };
        }
        return row;
      })
    );
  };

  const handleSave = () => {
    // return an array of updated products to be sent to the backend
    const updatedProducts = tableData.map((product) => {
      return {
        purchase_order_product_id: product.purchase_order_product_id,
        product_id: product.id,
        quantity_received: product.quantity_received,
        quantity_missing: product.quantity_missing,
        reason_id: product.reason_id,
        upc: product.upc,
        expire_date: product.expire_date,
      };
    });

    const data = {
      orderId: params.orderId,
      purchaseOrderProductsUpdates: updatedProducts,
    };

    updateIncomingOrderProducts({
      orderId: Number(params.orderId),
      incomingOrderProductUpdates: data.purchaseOrderProductsUpdates,
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

  if (!data) return null;

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
