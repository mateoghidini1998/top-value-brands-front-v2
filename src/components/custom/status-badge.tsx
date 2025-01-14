"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";

// Solo variantes válidas para Badge
type BadgeVariant = "destructive" | "secondary" | "default" | "outline";

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

export type StatusType = keyof typeof PURCHASE_ORDER_STATUSES;

interface StatusBadgeProps {
  status: StatusType;
  onStatusChange: (newStatus: number) => Promise<void>;
}

const getStatusConfig = (
  status: StatusType
): { variant: BadgeVariant; label: string } => {
  const configs: Record<StatusType, { variant: BadgeVariant; label: string }> =
    {
      Rejected: { variant: "destructive", label: "Rejected" },
      Pending: { variant: "secondary", label: "Pending" },
      "Good to go": { variant: "default", label: "Good to Go" },
      Cancelled: { variant: "destructive", label: "Cancelled" },
      "In transit": { variant: "secondary", label: "In Transit" }, // Reemplazado
      Arrived: { variant: "default", label: "Arrived" }, // Reemplazado
      Closed: { variant: "outline", label: "Closed" },
      "Waiting for supplier approval": {
        variant: "secondary",
        label: "Waiting Approval",
      },
    };

  return configs[status];
};

export function StatusBadge({ status, onStatusChange }: StatusBadgeProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const statusConfig = getStatusConfig(status);

  const handleStatusChange = async (newStatus: number) => {
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
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
          {Object.entries(PURCHASE_ORDER_STATUSES).map(([key, value]) => (
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
