"use client";
import EditableOrderNotes from "@/components/custom/editable-order-notes";
import LoadingSpinner from "@/components/custom/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PurchaseOrderProvider } from "@/contexts/orders.context";
import { useGetPurchaseOrderSummary, useUpdateOrderNotes } from "../hooks";
import OrderProductsTable from "./components/order-products-list.component";
import OrderDetails from "./components/order-details.component";
import { UserResource } from "@/types/auth.type";
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();

  const customUser: UserResource = {
    publicMetadata: {
      role: user?.publicMetadata.role as string,
    },
    username: user?.username as string | null,
    primaryEmailAddress: {
      emailAddress: user?.primaryEmailAddress?.emailAddress as string | null,
    },
  };
  
  const isWalmartUser = customUser?.publicMetadata.role.split('_').includes("walmartonly");

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

  const { order, purchaseOrderProducts } = isWalmartUser ? { order: ordersSummaryResponse.data.order, purchaseOrderProducts: ordersSummaryResponse.data.purchaseOrderProducts.filter((product) => product.marketplace === "Walmart") } : ordersSummaryResponse.data;

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
          isWalmartUser={isWalmartUser}
        />
      </div>
    </PurchaseOrderProvider>
  );
}
