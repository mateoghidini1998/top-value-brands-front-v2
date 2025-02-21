"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ClockIcon,
  IdCardIcon,
  Pencil,
  PlaneIcon,
  Save,
  StoreIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "../create/_components/tables/data-table";
import { createColumns, palletCols } from "./columns";
import { useShipmentQuery } from "./hooks/useShipmentQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/helpers";

export interface ManifestPalletTable {
  pallet_id: number;
  pallet_number: string;
  warehouse_location: string;
}

export default function Page({ params }: { params: { shipmentId: string } }) {
  const { data, error } = useShipmentQuery(params.shipmentId);
  const [isEditing, setIsEditing] = useState(false);
  const [pallets, setPallets] = useState<ManifestPalletTable[]>([]);

  useEffect(() => {
    if (data?.PalletProducts) {
      const uniquePallets: ManifestPalletTable[] = [];

      data.PalletProducts.forEach((item) => {
        if (!uniquePallets.some((p) => p.pallet_id === item.pallet_id)) {
          uniquePallets.push({
            pallet_id: item.pallet_id,
            pallet_number: item.pallet_number,
            warehouse_location: item.warehouse_location,
          });
        }
      });

      setPallets(uniquePallets);
    }
  }, [data]);

  if (error) {
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

  if (!data) return null;

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
            <div className="text-2xl font-bold">#{data.shipment_number}</div>
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
              {formatDate(data.createdAt.toString())}
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
            <div className="text-2xl font-bold">{data.status}</div>
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
              {data.fba_shipment_id || "-"}
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
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Shipment
          </Button>
        )}
      </div>

      <DataTable pagination columns={palletCols} data={pallets} />
      <DataTable
        pagination
        columns={createColumns(isEditing)}
        data={data?.PalletProducts}
      />
    </div>
  );
}
