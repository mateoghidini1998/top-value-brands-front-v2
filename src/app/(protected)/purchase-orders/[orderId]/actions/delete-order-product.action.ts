import { apiRequest } from "@/helpers/http.adapter";

export interface DeleteOrderProductProps {
  orderProductId: string;
}

export default function deleteOrderProduct({
  orderProductId,
}: DeleteOrderProductProps) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/purchaseorderproduct/${orderProductId}`;

  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return apiRequest<string>(url, options);
}
