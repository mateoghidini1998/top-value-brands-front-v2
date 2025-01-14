import { apiRequest } from "@/helpers/http.adapter";
import { GetPurchaseOrdersResponse } from "@/types";

export interface GetIcomingShipmentsProps {
  page?: number;
  limit?: number;
  keyword?: string;
  supplier?: string;
  orderBy?: string;
  orderWay?: string;
}

export const getIncomingShipments = async ({
  page = 1,
  limit = 50,
  keyword = "",
  supplier = "",
  orderBy = "",
  orderWay = "",
}: GetIcomingShipmentsProps = {}): Promise<GetPurchaseOrdersResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/incoming-shipments?page=${page}&limit=${limit}&keyword=${keyword}&supplier=${supplier}&orderBy=${orderBy}&orderWay=${orderWay}`;
  return apiRequest<GetPurchaseOrdersResponse>(url);
};
