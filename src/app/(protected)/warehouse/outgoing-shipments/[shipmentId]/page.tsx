"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/helpers";
import {
  AlertCircle,
  ClockIcon,
  IdCardIcon,
  Pencil,
  PlaneIcon,
  Plus,
  Save,
  StoreIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DataTable } from "../create/_components/tables/data-table";
import { useGetShipmentById } from "../hooks/use-shipments-service";
import { createColumns, palletCols } from "./columns";
import { ShipmentPallet } from "@/types/shipments/get.types";

export interface ManifestPalletTable {
  pallet_id: number;
  pallet_number: string;
  warehouse_location: string;
}

export default function Page({ params }: { params: { shipmentId: string } }) {
  const { shipment, shipmentIsError } = useGetShipmentById(params.shipmentId);
  const [isEditing, setIsEditing] = useState(false);
  const [pallets, setPallets] = useState<ShipmentPallet[]>(
    shipment?.pallets || []
  );

  useEffect(() => {
    if (shipment) {
      setPallets(shipment.pallets);
    }
  }, [shipment]);

  if (shipmentIsError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the shipment details. Please try again
            later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!shipment) return null;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {/* Shiopment Number Card */}
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Shipment Number
            </CardTitle>
            <PlaneIcon className="w-4 h-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              #{shipment.shipment_number}
            </div>
            <p className="text-xs text-muted-foreground">Shipment number</p>
          </CardContent>
        </Card>

        {/* Date Work Order Issued Card */}
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Date Work Order Issued
            </CardTitle>
            <ClockIcon className="w-4 h-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {formatDate(shipment.createdAt.toString())}
            </div>
            <p className="text-xs text-muted-foreground">Date</p>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <StoreIcon className="w-4 h-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipment.status}</div>
            <p className="text-xs text-muted-foreground">Shipment status</p>
          </CardContent>
        </Card>

        {/* FBA Shipment ID Card */}
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              FBA Shipment ID
            </CardTitle>
            <IdCardIcon className="w-4 h-4 text-muted-foreground ml-auto" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {shipment.fba_shipment_id || "-"}
            </div>
            <p className="text-xs text-muted-foreground">FBA shipment ID</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        {isEditing ? (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => setIsEditing(false)}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="w-fit flex items-center justify-between gap-4">
            <Button
              disabled
              className={`${shipment.status !== "WORKING" && "hidden"} `}
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Shipment
            </Button>
            <Button
              disabled
              className={`${shipment.status !== "WORKING" && "hidden"} `}
            >
              <Plus className="h-4 w-4 mr-2" />
              <Link
                href={`/warehouse/outgoing-shipments/create?update=${shipment.id}`}
              >
                Add Products
              </Link>
            </Button>
          </div>
        )}
      </div>

      <DataTable pagination columns={palletCols(shipment.id)} data={pallets} />
      <DataTable
        pagination
        columns={createColumns(isEditing)}
        data={shipment?.PalletProducts}
      />
    </div>
  );
}
