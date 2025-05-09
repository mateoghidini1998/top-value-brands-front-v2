export interface GetOrdersProps {
  page?: number;
  limit?: number;
  keyword?: string;
  supplier?: string;
  status?: string;
  orderBy?: string;
  orderWay?: string;
  excludeStatus?: string;
}

export interface GetPurchaseOrdersResponse {
  success: boolean;
  total: number;
  pages: number;
  currentPage: number;
  data: Order[];
}

export interface Order {
  id: number;
  order_number: string;
  supplier_id: number;
  purchase_order_status_id: number;
  total_price: string;
  notes: string;
  is_active: boolean;
  updatedStatusAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  purchaseOrderStatus: PurchaseOrderStatus;
  purchaseOrderProducts: PurchaseOrderProductFromOrder[];
  status: string;
  incoming_order_notes: string | null;
  average_roi: number | null;
  supplier_name: string;
  trackedProducts: TrackedProduct[];
}

export interface PurchaseOrderProductFromOrder {
  id: number;
  purchase_order_id: number;
  product_id: number;
  unit_price: string;
  product_cost: string;
  total_amount: string;
  profit: string;
  quantity_purchased: number;
  quantity_received: number | null;
  quantity_missing: number;
  quantity_available: number;
  reason_id: number | null;
  notes: null;
  expire_date: null;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  Product: Product;
  product_name: string;
}

interface Product {
  id: number;
  ASIN: string;
  product_image: string;
  product_name: string;
  seller_sku: string;
  warehouse_stock: string;
  FBA_available_inventory: number;
  reserved_quantity: number;
  Inbound_to_FBA: number;
  supplier_id: number;
  supplier_item_number: null | string;
  upc: null | string;
  product_cost: string;
  pack_type: null | string;
  is_active: boolean;
  in_seller_account: boolean;
  createdAt: Date;
  updatedAt: Date;
  dangerous_goods: string;
}

interface PurchaseOrderStatus {
  id: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TrackedProduct {
  id: number;
  product_id: number;
  current_rank: number;
  thirty_days_rank: number;
  ninety_days_rank: number;
  units_sold: number;
  product_velocity: number;
  lowest_fba_price: number;
  fees: number | null;
  profit: number | null;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  product_name: string;
  ASIN: string;
  seller_sku: string;
  supplier_name: string;
  product_image: string;
  product_cost: string;
}
