import { apiRequest } from "@/helpers/http.adapter";
import { GetInventoryProps, GetProductsResponse } from "@/types";

export const getInventory = async ({
  page = 1,
  limit = 50,
  keyword = "",
  supplier = "",
  orderBy = "",
  orderWay = "",
}: GetInventoryProps): Promise<GetProductsResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?page=${page}&limit=${limit}&keyword=${keyword}&supplier=${supplier}&orderBy=${orderBy}&orderWay=${orderWay}`;
  return apiRequest<GetProductsResponse>(url);
};
