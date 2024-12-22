export interface ProductInOrder {
  id: string;
  product_id: string;
  supplier_id: string;
  product_name: string;
  product_image: string;
  ASIN: string;
  supplier_name: string;
  quantity: number;
  product_cost: number;
  total_amount: number;
  units_sold: number;
  fees: number;
  lowest_fba_price: number;
}
