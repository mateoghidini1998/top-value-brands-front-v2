// Create Purchase Order Types.
export interface CreateOrderRequest {
  order_number: string;
  supplier_id: number;
  purchase_order_status_id: number;
  products: CreateOrderProduct[];
  notes: string;
}

export interface CreateOrderProduct {
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
