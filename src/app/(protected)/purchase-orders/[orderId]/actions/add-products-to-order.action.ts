import { apiRequest } from "@/helpers/http.adapter";

interface AddProductsToOrderProps {
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

export const addProductsToOrder = ({
  orderId,
  products,
}: AddProductsToOrderProps) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/add-products/${orderId}`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      products,
    }),
  };
  return apiRequest<string>(url, options);
};
