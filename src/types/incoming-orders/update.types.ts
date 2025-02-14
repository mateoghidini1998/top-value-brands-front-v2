export interface UpdateIncomingOrderProductsProps {
  orderId: number;
  incomingOrderProductUpdates: IncomingOrderProductUpdates[];
}

export interface IncomingOrderProductUpdates {
  purchase_order_product_id: number;
  product_id: number;
  quantity_received: number;
  quantity_missing: number;
  reason_id: number | null;
  upc: string | null;
  expire_date: string | null;
}
