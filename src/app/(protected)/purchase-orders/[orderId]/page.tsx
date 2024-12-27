"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { GetPurchaseOrderSummaryResponse } from "../interfaces/orders.interface";
import { DataTable } from "@/components/custom/data-table";

async function getPurchaseOrder(
  orderId: string
): Promise<GetPurchaseOrderSummaryResponse> {
  const response = await fetch(
    `http://localhost:5000/api/v1/purchaseorders/summary/${orderId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch purchase order");
  }
  return response.json();
}

export default function PurchaseOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { data, isLoading, error } = useQuery<GetPurchaseOrderSummaryResponse>({
    queryKey: ["purchase-order", params.orderId],
    queryFn: () => getPurchaseOrder(params.orderId),
  });

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading purchase order: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const { order_number, total_price, updatedStatusAt, notes } =
    data.data.purchaseOrder;

  const { trackedProductsOfTheOrder } = data.data;

  return (
    <div className="py-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Purchase Order {order_number}</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${parseFloat(total_price).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(updatedStatusAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trackedProductsOfTheOrder.length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={trackedProductsOfTheOrder} />
        </CardContent>
      </Card>
    </div>
  );
}
