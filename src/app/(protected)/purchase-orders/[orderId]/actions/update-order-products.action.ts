import { apiRequest } from "@/helpers/http.adapter";
import { PurchaseOrderProductsUpdates } from "@/types";

export interface UpdateOrderProductsProps {
  orderId: number;
  purchaseOrderProductsUpdates: PurchaseOrderProductsUpdates[];
}

export default function updateOrderProducts({
  orderId,
  purchaseOrderProductsUpdates,
}: UpdateOrderProductsProps) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/${orderId}/products`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      purchaseOrderProductsUpdates: purchaseOrderProductsUpdates,
    }),
  };
  return apiRequest<string>(url, options);
}
