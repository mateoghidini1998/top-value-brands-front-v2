"use client";
import { usePurchaseOrder } from "@/app/(protected)/purchase-orders/[orderId]/hooks";
import { StatusBadge } from "./status-badge";

export interface StatusCellProps {
  orderId: string;
  statusDescription:
    | "Rejected"
    | "Pending"
    | "Good to go"
    | "Cancelled"
    | "In transit"
    | "Arrived"
    | "Closed"
    | "Waiting for supplier approval";
}

export function StatusCell({ orderId, statusDescription }: StatusCellProps) {
  const { updateOrderStatus } = usePurchaseOrder(orderId);
  return (
    <StatusBadge
      status={statusDescription}
      onStatusChange={async (newStatus) => {
        updateOrderStatus({ orderId, status: newStatus.toString() });
      }}
    />
  );
}
