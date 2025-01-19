import { apiRequest } from "@/helpers/http.adapter";

interface CreateShipmentProps {
  palletproducts: { pallet_product_id: number; quantity: number }[];
  shipment_number: string;
}

export const createShipment = (shipment: CreateShipmentProps) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/shipments`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shipment), // Envía los datos directamente
  };
  return apiRequest<string>(url, options);
};
