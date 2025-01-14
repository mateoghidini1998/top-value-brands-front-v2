import { apiRequest } from "@/helpers/http.adapter";
import { Product } from "@/types";

export interface EditProductProps {
  id: number;
  ASIN: string;
  seller_sku?: string | null;
  product_cost?: number | null;
  supplier_id?: number | null;
  supplier_item_number?: number | null;
  upc?: string | null;
  pack_type?: number | null;
}

export const editProduct = async (data: EditProductProps): Promise<Product> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/addExtraInfoToProduct`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return apiRequest<Product>(url, options);
};
