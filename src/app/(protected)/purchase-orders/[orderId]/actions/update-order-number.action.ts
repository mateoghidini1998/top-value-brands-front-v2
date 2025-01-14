import { apiRequest } from "@/helpers/http.adapter";

export interface UpdateOrderNumberProps {
  orderId: string;
  order_number: string;
}

export default function updateOrderNumber({
  orderId,
  order_number,
}: UpdateOrderNumberProps) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/orderNumber/${orderId}`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order_number,
    }),
  };
  return apiRequest<string>(url, options);
}
