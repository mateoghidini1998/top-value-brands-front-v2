import { apiRequest } from "@/helpers/http.adapter";

export interface UpdateOrderStatusProps {
  orderId: string;
  status: string;
}

export const updateOrderStatus = ({
  orderId,
  status,
}: UpdateOrderStatusProps) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/${orderId}/status`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  };
  return apiRequest<string>(url, options);
};
