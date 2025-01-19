import { apiRequest } from "@/helpers/http.adapter";
import { GetShipmentsResponse } from "@/types";

export interface GetShipmentsProps {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  orderBy?: string;
  orderWay?: string;
}

export const getShipments = async ({
  page = 1,
  limit = 50,
  keyword = "",
  status = "",
  orderBy = "",
  orderWay = "",
}: GetShipmentsProps = {}): Promise<GetShipmentsResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/shipments?page=${page}&limit=${limit}&keyword=${keyword}&status=${status}&orderBy=${orderBy}&orderWay=${orderWay}`;
  return apiRequest<GetShipmentsResponse>(url);
};
