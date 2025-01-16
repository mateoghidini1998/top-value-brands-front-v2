import { apiRequest } from "@/helpers/http.adapter";
import { IncomingOrderProductUpdates } from "@/types";

export interface UpdateIncomingOrderProductsProps {
  orderId: number;
  incomingOrderProductUpdates: IncomingOrderProductUpdates[];
}

export default function updateIncomingOrderProducts({
  orderId,
  incomingOrderProductUpdates,
}: UpdateIncomingOrderProductsProps) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/update-incoming-order/${orderId}`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      incomingOrderProductUpdates: incomingOrderProductUpdates,
    }),
  };
  return apiRequest<string>(url, options);
}
