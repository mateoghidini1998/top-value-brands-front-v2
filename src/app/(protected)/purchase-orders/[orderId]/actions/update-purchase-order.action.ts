import { apiRequest } from "@/helpers/http.adapter";

export interface UpdatePurchaseOrderProps {
  orderId: string;
  notes?: string;
  purchase_order_status_id?: number;
  products?: {
    fees: number;
    lowest_fba_price: number;
    product_cost: string;
    product_id: number;
    quantity: number;
  }[];
}

export default function updatePurchaseOrder({
  orderId,
  notes,
  purchase_order_status_id,
  products,
}: UpdatePurchaseOrderProps) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/${orderId}`;

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...(notes && { notes }),
      ...(purchase_order_status_id && { purchase_order_status_id }),
      ...(products && { products }),
    }),
  };

  return apiRequest(url, options);
}
