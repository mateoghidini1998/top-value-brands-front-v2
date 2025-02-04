import { apiRequest } from "@/helpers/http.adapter";
import { EditProductProps, PalletProductResponse } from "@/types";

export const editProduct = async (
  data: EditProductProps
): Promise<PalletProductResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/addExtraInfoToProduct`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return apiRequest<PalletProductResponse>(url, options);
};
