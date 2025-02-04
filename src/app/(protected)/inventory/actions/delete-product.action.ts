import { apiRequest } from "@/helpers/http.adapter";
import { PalletProductResponse } from "@/types";

export const deleteProduct = async (
  id: number
): Promise<PalletProductResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/disable`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  };
  return apiRequest<PalletProductResponse>(url, options);
};
