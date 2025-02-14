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
import { useShipmentMutations } from "../hooks/useShipmentMutation";
import { toast } from "sonner";
import { usePrefetchShipmentByID } from "../[shipmentId]/hooks/useShipmentQuery";

interface ActionsCellProps {
  shipmentId: number;
}

const ActionsCell = ({ shipmentId }: ActionsCellProps) => {
  const [shipmentToDelete, setShipmentToDelete] = useState<number>(0);
  const { deleteShipmentAsync } = useShipmentMutations();
  const { prefetchShipmentByID } = usePrefetchShipmentByID(
    shipmentId.toString()
  );

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
    if (shipmentToDelete) {
      try {
        await deleteShipmentAsync({ shipmentId: shipmentToDelete });
        setShipmentToDelete(0);
      } catch (error) {
        console.error("Failed to delete shipment:", error);
      }
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
              Are you sure you want to delete this shipmnet?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Pallets available quantity will be
              restored.
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
