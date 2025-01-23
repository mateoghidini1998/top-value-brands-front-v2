"use client";
import { DataTable } from "@/components/custom/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/helpers/format-date";
import {
  AlertCircle,
  ClockIcon,
  IdCardIcon,
  PlaneIcon,
  StoreIcon,
} from "lucide-react";
import { columns } from "./columns";
import { useShipmentQuery } from "./hooks/useShipmentQuery";

export default function Page({ params }: { params: { shipmentId: string } }) {
  const { data, error } = useShipmentQuery(params.shipmentId);

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Shiopment Number Card */}
        <Card>
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
        <Card>
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
        <Card>
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
        <Card>
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
      <DataTable
        columns={columns}
        data={data?.PalletProducts}
        dataLength={50}
      />
    </div>
  );
}
