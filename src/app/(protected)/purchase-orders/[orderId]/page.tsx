"use client";
import { PurchaseOrderProvider } from "@/contexts/orders.context";
import { useGetPurchaseOrderSummary } from "../hooks";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OrderProductsTable from "./components/order-products-list.component";
import OrderNotes from "./components/order-notes.component";
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
        <OrderNotes order={order} orderId={params.orderId} />
        <OrderProductsTable
          products={purchaseOrderProducts}
          orderId={params.orderId}
        />
      </div>
    </PurchaseOrderProvider>
  );
}
