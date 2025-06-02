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
  useAddFbaShipmentId,
  useAddReferenceId,
  useDeleteShipment,
  usePrefetchShipmentByID,
  useUpdateFbaShipmentStatusToShipped,
  updateShipmentStatusToReadyToBeShipped,
  useGetShipmentById,
} from "../hooks/use-shipments-service";
import { Input } from "@/components/ui/input";

interface ActionsCellProps {
  shipmentId: number;
}

const ActionsCell = ({ shipmentId }: ActionsCellProps) => {
  const [selectedShipment, setSelectedShipment] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showReferenceIdDialog, setShowReferenceIdDialog] =
    useState<boolean>(false);
  const [showFbaShipmentIdDialog, setShowFbaShipmentIdDialog] =
    useState<boolean>(false);
  const { deleteShipmentAsync } = useDeleteShipment(
    selectedShipment.toString()
  );

  const { updateFbaShipmentStatusToShippedAsync } =
    useUpdateFbaShipmentStatusToShipped(selectedShipment.toString());

  const { updateShipmentStatusToReadyToBeShippedAsync } =
    updateShipmentStatusToReadyToBeShipped(selectedShipment.toString());

  const { prefetchShipmentByID } = usePrefetchShipmentByID(
    shipmentId.toString()
  );

  const { shipment } = useGetShipmentById(shipmentId.toString());

  const { addReferenceIdAsync } = useAddReferenceId(shipmentId.toString());
  const { addFbaShipmentIdAsync } = useAddFbaShipmentId(shipmentId.toString());
  const [referenceId, setReferenceId] = useState<string>("");
  const [fbaShipmentId, setFbaShipmentId] = useState<string>("");

  const prefetchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePrefetch = () => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }

    prefetchTimeout.current = setTimeout(() => {
      prefetchShipmentByID();
    }, 200); // Adjust delay as needed (500ms)
  };

  const handleCancelPrefetch = () => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }
  };

  const handleDeleteShipment = async () => {
    if (selectedShipment) {
      try {
        await deleteShipmentAsync(selectedShipment.toString());
        setSelectedShipment(0);
        setIsDeleting(false);
      } catch (error) {
        console.error("Failed to delete shipment:", error);
      }
    }
  };

  const handleAddReferenceId = async () => {
    try {
      await addReferenceIdAsync(referenceId);
    } catch (error) {
      console.error("Failed to add reference ID:", error);
    }
  };

  const handleAddFbaShipmentId = async () => {
    try {
      await addFbaShipmentIdAsync(fbaShipmentId);
    } catch (error) {
      console.error("Failed to add shipment ID:", error);
    }
  };

  const handleDownload2DWorkflow = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/shipments/${id}/download`
      );

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      // Crear un blob con los datos de la respuesta
      const blob = await response.blob();

      // Crear una URL para el blob
      const url = window.URL.createObjectURL(blob);

      // Crear un enlace temporal para la descarga
      const link = document.createElement("a");
      link.href = url;

      // Asignar el nombre del archivo (puedes personalizar este nombre si lo necesitas)
      link.download = `2DWorkflow_Shipment_${id}.xlsx`;

      // Simular un clic en el enlace para iniciar la descarga
      document.body.appendChild(link);
      link.click();

      // Limpiar el DOM
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      toast.error("Error al descargar el archivo");
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
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`outgoing-shipments/${shipmentId}`}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleDownload2DWorkflow(shipmentId)}
          >
            Download 2D Workflow
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedShipment(shipmentId);
              setIsDeleting(true);
            }}
          >
            Delete Shipment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowReferenceIdDialog(true)}>
            Add Reference ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowFbaShipmentIdDialog(true)}>
            Add FBA Shipment ID
          </DropdownMenuItem>
          {shipment?.status !== "WORKING" && shipment?.status !== "SHIPPED" && (
            <DropdownMenuItem onClick={() => setSelectedShipment(shipmentId)}>
              Set Status To Shipped
            </DropdownMenuItem>
          )}
          {shipment?.status === "WORKING" && (
            <DropdownMenuItem onClick={() => setSelectedShipment(shipmentId)}>
              Set Status To Ready To Be Shipped
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Delete Dialog */}
      <AlertDialog
        open={!!selectedShipment && isDeleting}
        onOpenChange={(open) => !open}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this shipment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Pallets available quantity will be
              restored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedShipment(0);
                setIsDeleting(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteShipment}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Status TO Shipped Dialog */}
      <AlertDialog
        open={!!selectedShipment && !isDeleting}
        onOpenChange={(open) => !open}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to update this shipment to shipped?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Warehouse stock will be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedShipment(0)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                updateFbaShipmentStatusToShippedAsync(shipmentId.toString())
              }
            >
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!selectedShipment && !isDeleting}
        onOpenChange={(open) => !open}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to update this shipment to ready to be shipped?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Warehouse stock will be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedShipment(0)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                updateShipmentStatusToReadyToBeShippedAsync(shipmentId.toString())
              }
            >
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Reference ID Dialog */}
      <AlertDialog
        open={showReferenceIdDialog}
        onOpenChange={(open) => !open && setShowReferenceIdDialog(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Reference ID to Shipment</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <Input
              placeholder="Reference ID"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
            />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddReferenceId}>
              Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Shipment ID Dialog */}
      <AlertDialog
        open={showFbaShipmentIdDialog}
        onOpenChange={(open) => !open && setShowFbaShipmentIdDialog(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Shipment ID to Shipment</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <Input
              placeholder="FBA Shipment ID"
              value={fbaShipmentId}
              onChange={(e) => setFbaShipmentId(e.target.value)}
            />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddFbaShipmentId}>
              Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActionsCell;
