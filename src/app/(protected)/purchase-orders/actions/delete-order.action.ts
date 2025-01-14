import { apiRequest } from "@/helpers/http.adapter";

interface DeleteOrderResponse {
  success: boolean;
  data: DeleteOrderData;
}

interface DeleteOrderData {
  id: number;
  order_number: string;
  supplier_id: number;
  purchase_order_status_id: number;
  total_price: string;
  notes: string;
  is_active: boolean;
  updatedStatusAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

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
