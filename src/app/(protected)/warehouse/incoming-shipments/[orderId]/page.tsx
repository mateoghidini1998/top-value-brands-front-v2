"use client";

import { useOrderSummaryQuery } from "@/app/(protected)/purchase-orders/[orderId]/hooks";
import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PurchaseOrderSummaryProducts } from "@/types";
import { useState } from "react";
import { columns } from "./columns";

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

  const handleQuantityReceivedChange = (rowId: string, value: number) => {
    setTableData((prevData) =>
      prevData.map((row) => {
        if (row.id === Number(rowId)) {
          const quantity_missing = row.quantity_purchased - value;
          return {
            ...row,
            quantity_received: value,
            quantity_missing: quantity_missing >= 0 ? quantity_missing : 0,
          };
        }
        return row;
      })
    );
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
      <DataTable
        columns={columns(handleQuantityReceivedChange)}
        data={tableData}
        dataLength={tableData.length}
      />
    </div>
  );
}
