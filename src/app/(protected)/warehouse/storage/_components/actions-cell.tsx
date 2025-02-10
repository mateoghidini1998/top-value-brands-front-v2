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
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  useDeletePallet,
  usePrefetchPalletByID,
} from "../hooks/use-pallets-service";

interface ActionsCellProps {
  palletId: number;
}

const ActionsCell = ({ palletId }: ActionsCellProps) => {
  const { deletePalletAsync } = useDeletePallet(palletId);
  const [palletToDelete, setPalletToDelete] = useState<number>(0);
  const { prefetchPalletByID } = usePrefetchPalletByID(palletId.toString());

  const prefetchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePrefetch = () => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }

    prefetchTimeout.current = setTimeout(() => {
      prefetchPalletByID();
    }, 200);
  };

  const handleCancelPrefetch = () => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }
  };

  const handleDeleteOrder = async () => {
    if (palletToDelete) {
      try {
        await deletePalletAsync(palletToDelete.toString()).then(() => {
          toast.success("Pallet deleted successfully");
        });
        setPalletToDelete(0);
      } catch (error) {
        console.error("Failed to delete pallet:", error);
        toast.error("Failed to delete pallet");
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
            <Link href={`storage/${palletId}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPalletToDelete(palletId)}>
            Delete Pallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={!!palletToDelete}
        onOpenChange={(open) => !open && setPalletToDelete(0)}
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
