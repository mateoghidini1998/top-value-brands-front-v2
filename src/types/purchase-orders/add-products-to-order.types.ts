export interface AddProductsToOrderProps {
  orderId: string;
  products: ProductsToAdd[];
}

export interface ProductsToAdd {
  product_id: number;
  quantity: number;
  product_cost: string;
  fees: number;
  lowest_fba_price: number;
}
