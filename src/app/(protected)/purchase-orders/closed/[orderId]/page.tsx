"use client";
import { ProductTitle } from "@/components/custom/product-title";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/types";
import { useUser } from "@clerk/nextjs";
import { AlertTriangleIcon } from "lucide-react";
import { useEffect } from "react";
import { useGetPurchaseOrderSummary } from "../../hooks";
import UploadInvoiceFile from "../_components/upload-invoice";
import { UserResource } from "@/types/auth.type";

interface PageProps {
  params: {
    orderId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { user } = useUser();

  const customUser: UserResource = {
    publicMetadata: {
      role: user?.publicMetadata.role as string,
      warehouse: user?.publicMetadata.warehouse as string,
    },
    username: user?.username as string | null,
    primaryEmailAddress: {
      emailAddress: user?.primaryEmailAddress?.emailAddress as string | null,
    },
  };
  
  const isWalmartUser = customUser?.publicMetadata.warehouse === "walmart";

  const {
    ordersSummaryResponse,
    ordersSummaryIsLoading,
    ordersSummaryIsError,
    ordersSummaryError,
  } = useGetPurchaseOrderSummary(params.orderId);

  useEffect(() => {
    if (ordersSummaryIsError) {
      console.error("Error fetching order summary:", ordersSummaryError);
    }
  }, [ordersSummaryIsError, ordersSummaryError]);

  if (ordersSummaryIsLoading) {
    return <LoadingSkeleton />;
  }

  if (ordersSummaryIsError || !ordersSummaryResponse?.success) {
    return <ErrorAlert error={ordersSummaryError} />;
  }

  const { order, purchaseOrderProducts } = isWalmartUser ? { order: ordersSummaryResponse.data.order, purchaseOrderProducts: ordersSummaryResponse.data.purchaseOrderProducts.filter((product) => product.marketplace === "Walmart") } : ordersSummaryResponse.data;

  return (
    <div className="">
      <h1 className="text-2xl font-bold py-4">Order - {order.order_number}</h1>

      {/* @ts-expect-error @typescript-eslint/no-unsafe-member-access */}
      <OrderSummaryCard order={order} userRole={user!.publicMetadata.role} />

      <UploadInvoiceFile orderId={params.orderId} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Purchase Order Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>UPC</TableHead>
                <TableHead>Seller SKU</TableHead>
                <TableHead>Item No.</TableHead>
                <TableHead>ASIN</TableHead>
                <TableHead>Quantity Purchased</TableHead>
                <TableHead>Quantity Received</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrderProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <ProductTitle
                      product_image={product.product_image}
                      product_name={product.product_name}
                      ASIN={product.ASIN}
                      in_seller_account={product.in_seller_account}
                      width={300}
                    />
                  </TableCell>
                  <TableCell>{product.upc}</TableCell>
                  <TableCell>{product.seller_sku}</TableCell>
                  <TableCell>{product.supplier_item_number}</TableCell>
                  <TableCell>{product.ASIN}</TableCell>
                  <TableCell>{product.quantity_purchased}</TableCell>
                  <TableCell>{product.quantity_received}</TableCell>
                  <TableCell>{product.reason}</TableCell>
                  <TableCell>
                    <ProductStatus
                      quantityPurchased={product.quantity_purchased}
                      quantityReceived={product.quantity_received}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderSummaryCard({
  order,
  userRole,
}: {
  order: Order;
  userRole: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div>
            <dt className="font-medium text-gray-500">Order Number</dt>
            <dd>{order.order_number}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Status</dt>
            <dd>{order.status}</dd>
          </div>
          {userRole.toLowerCase() === "admin" && (
            <div>
              <dt className="font-medium text-gray-500">Total Price</dt>
              <dd>$ {order.total_price.toLocaleString()}</dd>
            </div>
          )}
          <div>
            <dt className="font-medium text-gray-500">Supplier</dt>
            <dd>{order.supplier_name.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Created At</dt>
            <dd>{new Date(order.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Last Updated</dt>
            <dd>{new Date(order.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

function ProductStatus({
  quantityPurchased,
  quantityReceived,
}: {
  quantityPurchased: number;
  quantityReceived: number;
}) {
  if (quantityReceived === quantityPurchased) {
    return <Badge variant="arrived">Fully Received</Badge>;
  } else if (quantityReceived === 0) {
    return <Badge variant="destructive">Not Received</Badge>;
  } else {
    return <Badge variant="pending">Partially Received</Badge>;
  }
}

function LoadingSkeleton() {
  return (
    <div className="">
      <Skeleton className="h-12 w-1/2 mb-6" />
      <Skeleton className="h-64 w-full mb-8" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

function ErrorAlert({ error }: { error: Error | null }) {
  return (
    <Alert variant="destructive">
      <AlertTriangleIcon className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error
          ? error.message
          : "An error occurred while fetching the order summary."}
      </AlertDescription>
    </Alert>
  );
}
