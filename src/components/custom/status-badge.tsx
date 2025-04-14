"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PurchaseOrderProductFromOrder } from "@/types/purchase-orders/get.types";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Solo variantes válidas para Badge
type BadgeVariant =
  | "destructive"
  | "secondary"
  | "default"
  | "outline"
  | "arrived"
  | "pending"
  | "closed"
  | "cancelled"
  | "waiting"
  | "intransit";

const PURCHASE_ORDER_STATUSES = {
  Rejected: 1,
  Pending: 2,
  "Good to go": 3,
  Cancelled: 4,
  "In transit": 5,
  Arrived: 6,
  Closed: 7,
  "Waiting for supplier approval": 8,
} as const;

const INCOMING_PURCHASE_ORDER_STATUSES = {
  "In transit": 5,
  Arrived: 6,
  Closed: 7,
} as const;

export type StatusType = keyof typeof PURCHASE_ORDER_STATUSES;

interface StatusBadgeProps {
  status: StatusType;
  products: PurchaseOrderProductFromOrder[]; // Puedes definir un tipo más específico si lo deseas
  onStatusChange: (newStatus: number) => Promise<void>;
  isWarehouse?: boolean;
}

const getStatusConfig = (
  status: StatusType
): { variant: BadgeVariant; label: string } => {
  const configs: Record<StatusType, { variant: BadgeVariant; label: string }> =
    {
      Rejected: { variant: "cancelled", label: "Rejected" },
      Pending: { variant: "pending", label: "Pending" },
      "Good to go": { variant: "arrived", label: "Good to Go" },
      Cancelled: { variant: "cancelled", label: "Cancelled" },
      "In transit": { variant: "intransit", label: "In Transit" }, // Reemplazado
      Arrived: { variant: "arrived", label: "Arrived" }, // Reemplazado
      Closed: { variant: "closed", label: "Closed" },
      "Waiting for supplier approval": {
        variant: "waiting",
        label: "Waiting Approval",
      },
    };

  return configs[status];
};

export function StatusBadge({
  status,
  onStatusChange,
  isWarehouse = false,
  products,
}: StatusBadgeProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const statusConfig = getStatusConfig(status);

  // console.log(products);

  const hasMissingDG = (products: PurchaseOrderProductFromOrder[]) => {
    console.log(products);
    if (products) {
      return products.some(
        (product) => product.Product.dangerous_goods === "--"
      );
    }
  };

  const handleStatusChange = async (newStatus: number) => {
    const missing = hasMissingDG(products);

    // Si el nuevo estado NO es (1) o *(2) y hay productos con DG, no permitir el cambio
    if (newStatus !== 1 && newStatus !== 2 && missing) {
      toast.error("Cannot change status when DG items are missing to define.");
      return;
    }

    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Badge
            variant={statusConfig.variant}
            className={cn(
              "cursor-pointer hover:opacity-80",
              isUpdating && "pointer-events-none"
            )}
          >
            {isUpdating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              statusConfig.label
            )}
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-50">
          {Object.entries(
            isWarehouse
              ? INCOMING_PURCHASE_ORDER_STATUSES
              : PURCHASE_ORDER_STATUSES
          ).map(([key, value]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => handleStatusChange(value)}
              disabled={status === key || isUpdating}
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              <Badge
                variant={getStatusConfig(key as StatusType).variant}
                className="w-full justify-start font-normal"
              >
                {getStatusConfig(key as StatusType).label}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
