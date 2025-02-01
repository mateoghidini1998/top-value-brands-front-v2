import { apiRequest } from "@/helpers/http.adapter";

export interface CheckShipmentProductProps {
  outgoingShipmentProductId: number;
}

export default function checkProductShipment({
  outgoingShipmentProductId,
}: CheckShipmentProductProps) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/shipments/checked/${outgoingShipmentProductId}`;
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return apiRequest<string>(url, options);
}
