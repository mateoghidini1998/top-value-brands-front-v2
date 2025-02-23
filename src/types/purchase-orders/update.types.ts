export interface UpdateOrderStatusProps {
  orderId: string;
  status: number;
}

export interface UpdateOrderNotesProps {
  orderId: string;
  notes: string;
}

export interface UpdateOrderNumberProps {
  orderId: string;
  order_number: string;
}

export interface UpdateOrderProductsProps {
  orderId: number;
  purchaseOrderProductsUpdates: PurchaseOrderProductsUpdates[];
}

export interface PurchaseOrderProductsUpdates {
  purchaseOrderProductId: number;
  quantityPurchased: number;
  product_cost: string;
  profit: string;
  unit_price: string;
}

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

export interface MergePurchaseOrdersProps {
  orderId: number;
  purchaseOrderIds: number[];
}
