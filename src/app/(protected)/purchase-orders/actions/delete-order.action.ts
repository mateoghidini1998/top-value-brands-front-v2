import { apiRequest } from "@/helpers/http.adapter";
import { DeleteOrderResponse } from "../interfaces/orders.interface";

export interface DeleteOrderProps {
  orderId: number;
}

export const deleteOrder = async ({
  orderId,
}: DeleteOrderProps): Promise<DeleteOrderResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/delete/${orderId}`;
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return apiRequest<DeleteOrderResponse>(url, options);
};
