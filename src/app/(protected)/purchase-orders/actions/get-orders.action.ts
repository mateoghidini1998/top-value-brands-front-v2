import { apiRequest } from "@/helpers/http.adapter";
import { GetPurchaseOrdersResponse } from "@/types";

export interface GetOrdersProps {
  page?: number;
  limit?: number;
  keyword?: string;
  supplier?: string;
  status?: string;
  orderBy?: string;
  orderWay?: string;
}

export const getOrders = async ({
  page = 1,
  limit = 50,
  keyword = "",
  supplier = "",
  status = "",
  orderBy = "",
  orderWay = "",
}: GetOrdersProps = {}): Promise<GetPurchaseOrdersResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders?page=${page}&limit=${limit}&keyword=${keyword}&supplier=${supplier}&status=${status}&orderBy=${orderBy}&orderWay=${orderWay}`;
  return apiRequest<GetPurchaseOrdersResponse>(url);
};
