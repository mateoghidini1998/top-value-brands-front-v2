"use client";
import { useUpdateOrderStatus } from "@/app/(protected)/purchase-orders/hooks";
import { StatusBadge } from "./status-badge";
import { PurchaseOrderProductFromOrder } from "@/types/purchase-orders/get.types";

export interface StatusCellProps {
  orderId: string;
  isWarehouse?: boolean;
  statusDescription:
    | "Rejected"
    | "Pending"
    | "Good to go"
    | "Cancelled"
    | "In transit"
    | "Arrived"
    | "Closed"
    | "Waiting for supplier approval";
  products?: PurchaseOrderProductFromOrder[];
}

export function StatusCell({
  orderId,
  statusDescription,
  isWarehouse = false,
  products,
}: StatusCellProps) {
  const { updateOrderStatusAsync } = useUpdateOrderStatus();

  return (
    <StatusBadge
      status={statusDescription}
      isWarehouse={isWarehouse}
      products={products!}
      onStatusChange={async (newStatus) => {
        updateOrderStatusAsync({ orderId, status: newStatus });
      }}
    />
  );
}
