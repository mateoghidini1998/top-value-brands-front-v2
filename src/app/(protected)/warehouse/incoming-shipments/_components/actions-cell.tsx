"use client";
import {
  useDeleteOrder,
  usePrefetchOrderSummary,
} from "@/app/(protected)/purchase-orders/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

interface ActionsCellProps {
  orderId: number;
}

const ActionsCell = ({ orderId }: ActionsCellProps) => {
  const { deleteOrderAsync } = useDeleteOrder();
  const { prefetchOrderSummary } = usePrefetchOrderSummary();
  const [orderToDelete, setOrderToDelete] = useState<number>(0);

  const prefetchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePrefetch = () => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }

    prefetchTimeout.current = setTimeout(() => {
      prefetchOrderSummary(orderId.toString());
    }, 200);
  };

  const handleCancelPrefetch = () => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }
  };

  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        await deleteOrderAsync({
          orderId: orderToDelete,
        });
        setOrderToDelete(0);
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onMouseEnter={handlePrefetch}
            onMouseLeave={handleCancelPrefetch}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="dark:bg-table_header">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`incoming-shipments/${orderId}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOrderToDelete(orderId)}>
            Delete Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={!!orderToDelete}
        onOpenChange={(open) => !open && setOrderToDelete(0)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionsCell;
