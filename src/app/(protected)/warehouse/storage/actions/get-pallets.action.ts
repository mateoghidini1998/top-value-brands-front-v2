import { apiRequest } from "@/helpers/http.adapter";
import { GetPalletsResponse } from "@/types";

export interface GetOrdersProps {
  page?: number;
  limit?: number;
  keyword?: string;
  pallet_number?: string;
  warehouse_location_id?: string;
  orderBy?: string;
  orderWay?: string;
}

export const getPallets = async ({
  page = 1,
  limit = 50,
  keyword = "",
  pallet_number = "",
  warehouse_location_id = "",
  orderBy = "",
  orderWay = "",
}: GetOrdersProps = {}): Promise<GetPalletsResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pallets?page=${page}&limit=${limit}&keyword=${keyword}&pallet_number=${pallet_number}&warehouse_location_id=${warehouse_location_id}&orderBy=${orderBy}&orderWay=${orderWay}`;
  return apiRequest<GetPalletsResponse>(url);
};
