export interface AddProductsToOrderProps {
  orderId: string;
  products: ProductsToAdd[];
}

export interface ProductsToAdd {
  fees: number;
  lowest_fba_price: number;
  product_cost: string;
  product_id: number;
  quantity: number;
}
