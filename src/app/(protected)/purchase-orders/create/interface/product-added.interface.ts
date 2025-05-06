export interface ProductInOrder {
  id: number;
  product_id: number;
  supplier_id: string;
  product_name: string;
  product_image: string;
  ASIN?: string;
  gtin?: string;
  supplier_name: string;
  quantity: number;
  product_cost: number;
  total_amount: number;
  units_sold: number;
  fees: number;
  lowest_fba_price: number;
  in_seller_account: boolean;
  pack_type: number | null;
}

export interface LocalStorageProduct {
  product_id: number;
  quantity: number;
  cost: number;
}
