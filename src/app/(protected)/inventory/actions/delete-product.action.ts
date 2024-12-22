import { apiRequest } from "@/helpers/http.adapter";
import { Product } from "../interfaces/product.interface";

export interface DeleteProductProps {
  id: number;
}

export const deleteProduct = async (
  data: DeleteProductProps
): Promise<Product> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/disable`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return apiRequest<Product>(url, options);
};
