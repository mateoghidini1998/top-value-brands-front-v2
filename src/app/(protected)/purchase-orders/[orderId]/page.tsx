"use client";

import { DataTable } from "@/components/custom/data-table";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns, CustomTrackedProduct } from "./columns";
import { PurchaseOrderProvider } from "./context/purchase-order.context";
import { usePurchaseOrder } from "./hooks/usePurchaseOrder";

export default function PurchaseOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { data, isLoading, error } = usePurchaseOrder(params.orderId);

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

  const { order_number, total_price, updatedStatusAt, notes } =
    data.purchaseOrder;
  const { trackedProductsOfTheOrder } = data;
  const { purchaseOrderProducts } = data.purchaseOrder;

  const productsForTable: CustomTrackedProduct[] =
    trackedProductsOfTheOrder.map((product) => ({
      ...product,
      total_amount: parseFloat(
        purchaseOrderProducts.find(
          (item) => item.product_id === product.product_id
        )?.total_amount ?? "0"
      ),
      quantity_purchased: parseInt(
        (
          purchaseOrderProducts.find(
            (item) => item.product_id === product.product_id
          )?.quantity_purchased ?? "0"
        ).toString()
      ),
      sellable_quantity:
        purchaseOrderProducts.find(
          (item) => item.product_id === product.product_id
        )?.quantity_purchased ?? 0,
    }));

  return (
    <PurchaseOrderProvider initialProducts={productsForTable}>
      <div className="py-6 space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Purchase Order {order_number}</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Price
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  Total Items
                </CardTitle>
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
            <DataTable columns={columns} data={productsForTable} />
          </CardContent>
        </Card>
      </div>
    </PurchaseOrderProvider>
  );
}
