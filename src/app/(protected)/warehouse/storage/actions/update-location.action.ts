import { apiRequest } from "@/helpers/http.adapter";

export interface UpdatePalletLocationProps {
  palletId: number;
  warehouseLocationId: number;
}

export default function updatePalletLocation({
  palletId,
  warehouseLocationId,
}: UpdatePalletLocationProps) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pallets/location/${palletId}`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      warehouse_location_id: warehouseLocationId,
    }),
  };
  return apiRequest<string>(url, options);
}
