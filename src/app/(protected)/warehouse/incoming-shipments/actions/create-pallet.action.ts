import { apiRequest } from "@/helpers/http.adapter";

interface CreatePalletProps {
  products: { purchaseorderproduct_id: number; quantity: number }[];
  pallet_number: number;
  purchase_order_id: number;
  warehouse_location_id: number;
}

export interface ProductPallet {
  products: { purchaseorderproduct_id: number; quantity: number }[];
}

export const createPallet = (pallet: CreatePalletProps) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pallets`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pallet), // Envía los datos directamente
  };
  return apiRequest<string>(url, options);
};
