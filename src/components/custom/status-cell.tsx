"use client";
import { useUpdateOrderStatus } from "@/app/(protected)/purchase-orders/hooks";
import { StatusBadge } from "./status-badge";

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
}

export function StatusCell({
  orderId,
  statusDescription,
  isWarehouse = false,
}: StatusCellProps) {
  const { updateOrderStatusAsync } = useUpdateOrderStatus();

  return (
    <StatusBadge
      status={statusDescription}
      isWarehouse={isWarehouse}
      onStatusChange={async (newStatus) => {
        updateOrderStatusAsync({ orderId, status: newStatus });
      }}
    />
  );
}
