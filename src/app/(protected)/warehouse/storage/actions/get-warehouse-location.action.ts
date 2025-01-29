import { apiRequest } from "@/helpers/http.adapter";
import { GetWarehouseLocationsResponse } from "@/types/warehouse-location.type";

export interface GetOrdersProps {
  available?: boolean;
}

export const getWarehouseLocations = async ({
  available = true,
}: GetOrdersProps = {}): Promise<GetWarehouseLocationsResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pallets/warehouse/locations?available=${available}`;
  return apiRequest<GetWarehouseLocationsResponse>(url);
};
