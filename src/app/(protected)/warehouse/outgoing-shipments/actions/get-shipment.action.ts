import { apiRequest } from "@/helpers/http.adapter";
import { GetShipemntByIDResponse } from "@/types";

export const getShipmentById = async (
  shipmentId: string
): Promise<GetShipemntByIDResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/shipments/${shipmentId}`;
  return await apiRequest<GetShipemntByIDResponse>(url);
};
