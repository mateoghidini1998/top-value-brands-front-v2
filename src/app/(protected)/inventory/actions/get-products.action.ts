import { GetInventoryResponse } from "@/app/(protected)/inventory/interfaces/product.interface";
import { apiRequest } from "@/helpers/http.adapter";

interface GetIventoryProps {
  page?: number;
  limit?: number;
  keyword?: string;
  supplier?: string;
  orderBy?: string;
  orderWay?: string;
}

export const getInventory = async ({
  page = 1,
  limit = 50,
  keyword = "",
  supplier = "",
  orderBy = "",
  orderWay = "",
}: GetIventoryProps): Promise<GetInventoryResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?page=${page}&limit=${limit}&keyword=${keyword}&supplier=${supplier}&orderBy=${orderBy}&orderWay=${orderWay}`;
  return apiRequest<GetInventoryResponse>(url);
};
