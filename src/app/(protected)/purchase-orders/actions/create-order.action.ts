import { apiRequest } from "@/helpers/http.adapter";

interface CreateOrderRequest {
  order_number: string;
  supplier_id: number;
  purchase_order_status_id: number;
  products: CreateOrderProduct[];
  notes: string;
}

interface CreateOrderProduct {
  product_id: number;
  product_cost: number;
  quantity: number;
}

export interface CreateOrderResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  id: number;
  order_number: string;
  supplier_id: number;
  purchase_order_status_id: number;
  total_price: string;
  notes: null;
  is_active: boolean;
  updatedStatusAt: null;
  createdAt: Date;
  updatedAt: Date;
  purchaseOrderProducts: PurchaseOrderProduct[];
}

export interface PurchaseOrderProduct {
  id: number;
  purchase_order_id: number;
  product_id: number;
  unit_price: string;
  product_cost: string;
  total_amount: string;
  profit: string;
  quantity_purchased: number;
  quantity_received: null;
  quantity_missing: null;
  quantity_available: number;
  reason_id: null;
  notes: null;
  expire_date: null;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const createOrder = (
  order: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  };

  return apiRequest<CreateOrderResponse>(url, options);
};
