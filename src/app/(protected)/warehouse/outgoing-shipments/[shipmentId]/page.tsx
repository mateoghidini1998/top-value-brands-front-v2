"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useShipmentQuery } from "./hooks/useShipmentQuery";
import { AlertCircle } from "lucide-react";
import { DataTable } from "@/components/custom/data-table";
import { columns } from "./columns";
import { formatDate } from "@/helpers/format-date";

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
      <div>
        <h1>Shipment Details</h1>
        <p>Work Order: {data.shipment_number}</p>
        <p>Data Work Issued: {formatDate(data.createdAt.toString())}</p>
      </div>
      <DataTable
        columns={columns}
        data={data?.PalletProducts}
        dataLength={50}
      />
    </div>
  );
}
