"use client";
import { useOrderSummaryMutations } from "@/app/(protected)/purchase-orders/[orderId]/hooks";
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
  const { updateOrderStatus } = useOrderSummaryMutations(orderId);

  return (
    <StatusBadge
      status={statusDescription}
      isWarehouse={isWarehouse}
      onStatusChange={async (newStatus) => {
        updateOrderStatus({ orderId, status: newStatus });
      }}
    />
  );
}
