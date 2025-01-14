import { apiRequest } from "@/helpers/http.adapter";

interface CreateProductRequest {
  ASIN: string;
  product_cost: number;
  supplier_id: number;
  supplier_item_number: string;
}
interface CreateProductResponse {
  id: number;
  ASIN: string;
  product_cost: string;
  supplier_id: string;
  supplier_item_number: string;
  product_name: string;
  updatedAt: Date;
  createdAt: Date;
}

export const createProduct = async (
  data: CreateProductRequest
): Promise<CreateProductResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/add`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return apiRequest<CreateProductResponse>(url, options);
};
