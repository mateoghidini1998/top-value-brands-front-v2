"use client";
import EditableOrderNotes from "@/components/custom/editable-order-notes";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PurchaseOrderProvider } from "@/contexts/orders.context";
import { useGetPurchaseOrderSummary, useUpdateOrderNotes } from "../hooks";
import OrderProductsTable from "./components/order-products-list.component";
import OrderDetails from "./components/order-details.component";

export default function PurchaseOrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const {
    ordersSummaryResponse,
    ordersSummaryIsLoading,
    ordersSummaryIsError,
    ordersSummaryError,
  } = useGetPurchaseOrderSummary(params.orderId);
  const { updateOrderNotesAsync } = useUpdateOrderNotes();

  if (ordersSummaryIsLoading) {
    return <LoadingSpinner />;
  }

  if (ordersSummaryIsError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading purchase order: {ordersSummaryError?.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!ordersSummaryResponse) return null;

  const { order, purchaseOrderProducts } = ordersSummaryResponse.data;

  return (
    <PurchaseOrderProvider initialProducts={purchaseOrderProducts}>
      <div className="py-6 space-y-8">
        <OrderDetails order={order} orderId={params.orderId} />
        <EditableOrderNotes
          notes={order.notes}
          orderId={params.orderId}
          onAction={updateOrderNotesAsync}
        />
        <OrderProductsTable
          products={purchaseOrderProducts}
          orderId={params.orderId}
        />
      </div>
    </PurchaseOrderProvider>
  );
}
