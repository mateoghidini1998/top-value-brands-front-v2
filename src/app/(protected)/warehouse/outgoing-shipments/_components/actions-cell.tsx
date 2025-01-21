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
import { useState } from "react";
import { useShipmentMutations } from "../hooks/useShipmentMutation";

interface ActionsCellProps {
  shipmentId: number;
}

const ActionsCell = ({ shipmentId }: ActionsCellProps) => {
  const [shipmentToDelete, setShipmentToDelete] = useState<number>(0);
  const { deleteShipmentAsync } = useShipmentMutations();

  const handleDeleteShipment = async () => {
    if (shipmentToDelete) {
      try {
        await deleteShipmentAsync({ shipmentId: shipmentToDelete });
        setShipmentToDelete(0);
      } catch (error) {
        console.error("Failed to delete shipment:", error);
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`outgoing-shipments/${shipmentId}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShipmentToDelete(shipmentId)}>
            Delete Shipment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={!!shipmentToDelete}
        onOpenChange={(open) => !open && setShipmentToDelete(0)}
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
            <AlertDialogAction onClick={handleDeleteShipment}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionsCell;
