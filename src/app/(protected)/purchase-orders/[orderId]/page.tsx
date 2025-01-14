"use client";

import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseOrderProvider } from "@/contexts/orders.context";
import { columns } from "./columns";
import SaveOrder from "./components/save-order-button";
import { usePurchaseOrder } from "./hooks/usePurchaseOrder";
import { formatDate } from "@/helpers/format-date";

export default function PurchaseOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { data, isLoading, error } = usePurchaseOrder(params.orderId);

  console.log(data);

  if (isLoading) {
    return <LoadingSpinner />;
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

  // Desestructuración de los datos de la orden y productos
  const {
    order_number,
    total_price,
    updatedAt,
    supplier_name,
    updatedStatusAt,
  } = data.data.order;
  const { purchaseOrderProducts } = data.data; // Los productos ahora están en purchaseOrderProducts

  return (
    <PurchaseOrderProvider initialProducts={purchaseOrderProducts}>
      <div className="py-6 space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Purchase Order {order_number}</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Render cards for order info */}
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Order Number:</strong> {order_number}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ${total_price}
                  </p>
                  <p>
                    <strong>Supplier:</strong> {supplier_name}
                  </p>
                  <p>
                    <strong>Updated At: </strong>
                    {formatDate(updatedAt) || "N/A"}
                  </p>
                  <p>
                    <strong>Updated Status At: </strong>
                    {formatDate(updatedStatusAt) || "N/A"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable columns={columns} data={purchaseOrderProducts} />
          </CardContent>
        </Card>

        <SaveOrder orderId={params.orderId} />
      </div>
    </PurchaseOrderProvider>
  );
}
