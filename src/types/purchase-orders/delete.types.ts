export interface DeleteOrderResponse {
  success: boolean;
  data: DeleteOrderData;
}

export interface DeleteOrderData {
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
