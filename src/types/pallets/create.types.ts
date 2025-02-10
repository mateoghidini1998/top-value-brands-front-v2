export interface CreatePalletProps {
  products: { purchaseorderproduct_id: number; quantity: number }[];
  pallet_number: number;
  purchase_order_id: number;
  warehouse_location_id: number;
}
