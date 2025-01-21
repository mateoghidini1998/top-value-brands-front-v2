import { apiRequest } from "@/helpers/http.adapter";

interface DeleteShipmentResponse {
  msg: string;
}

export interface DeleteShipmentProps {
  shipmentId: number;
}

export const deleteShipment = async ({
  shipmentId,
}: DeleteShipmentProps): Promise<DeleteShipmentResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/shipments/${shipmentId}`;
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return apiRequest<DeleteShipmentResponse>(url, options);
};
