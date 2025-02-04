import { apiRequest } from "@/helpers/http.adapter";
import { CreateProductRequest, CreateProductResponse } from "@/types";

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
