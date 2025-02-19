"use client";

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
import { useMergeOrdersContext } from "@/contexts/merge-orders.context";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";
import { useDeleteOrder, usePrefetchOrderSummary } from "../hooks";
import { Order } from "@/types/purchase-orders";

interface ActionsCellProps {
  order: Order;
  filterBySupplier: (supplierId: number) => void;
  ordersIsLoading: boolean;
  setSelectedSupplier: Dispatch<SetStateAction<number | null>>;
}

const ActionsCell = ({
  order,
  filterBySupplier,
  ordersIsLoading,
  setSelectedSupplier,
}: ActionsCellProps) => {
  const { deleteOrderAsync } = useDeleteOrder();
  const { prefetchOrderSummary } = usePrefetchOrderSummary();
  const [orderToDelete, setOrderToDelete] = useState<number>(0);
  const { setIsMerging } = useMergeOrdersContext();
  const prefetchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePrefetch = () => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }

    prefetchTimeout.current = setTimeout(() => {
      prefetchOrderSummary(order.id.toString());
    }, 200); // Adjust delay as needed (500ms)
  };

  const handleCancelPrefetch = () => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }
  };

  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        await deleteOrderAsync({ orderId: orderToDelete }).then(() => {
          setOrderToDelete(0);
        });
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/download/${order.id}`
      );

      if (!response.ok) {
        throw new Error("Error fetching data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `purchase-order-${order.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  const handleMergePO = async (supplierId: number) => {
    setSelectedSupplier(supplierId);
    filterBySupplier(supplierId);
    if (!ordersIsLoading) {
      setIsMerging(true);
      console.log("start merging POs");
    }
    console.log("end merging POs");
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
            <Link href={`/purchase-orders/${order.id}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOrderToDelete(order.id)}>
            Delete Order
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadPDF}>
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMergePO(order.supplier_id)}>
            Merge PO
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
