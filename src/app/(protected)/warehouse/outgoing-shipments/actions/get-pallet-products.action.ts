import { apiRequest } from "@/helpers/http.adapter";
import { GetAllPalletProductsResponse } from "@/types";

export const getAllPalletProducts = async (): Promise<
  GetAllPalletProductsResponse[]
> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pallets/products/all`;
  return await apiRequest<GetAllPalletProductsResponse[]>(url);
};
