import { apiRequest } from "@/helpers/http.adapter";
import { PalletProductResponse } from "@/types";

interface DeleteProductProps {
  id: number;
}

export const deleteProduct = async (
  data: DeleteProductProps
): Promise<PalletProductResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/disable`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return apiRequest<PalletProductResponse>(url, options);
};
