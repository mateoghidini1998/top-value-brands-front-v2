import { apiRequest } from "@/helpers/http.adapter";
import { GetOrdersResponse } from "../interfaces/orders.interface";

export interface GetOrdersProps {
  page?: number;
  limit?: number;
  keyword?: string;
  supplier?: string;
  orderBy?: string;
  orderWay?: string;
}

export const getOrders = async ({
  page = 1,
  limit = 50,
  keyword = "",
  supplier = "",
  orderBy = "",
  orderWay = "",
}: GetOrdersProps = {}): Promise<GetOrdersResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders?page=${page}&limit=${limit}&keyword=${keyword}&supplier=${supplier}&orderBy=${orderBy}&orderWay=${orderWay}`;
  return apiRequest<GetOrdersResponse>(url);
};
