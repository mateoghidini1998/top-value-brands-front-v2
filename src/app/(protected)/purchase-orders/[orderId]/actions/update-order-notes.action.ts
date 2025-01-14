import { apiRequest } from "@/helpers/http.adapter";

export interface UpdateOrderNotesProps {
  orderId: string;
  notes: string;
}

export default function updateOrderNotes({
  orderId,
  notes,
}: UpdateOrderNotesProps) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/${orderId}`;

  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notes,
    }),
  };

  return apiRequest<string>(url, options);
}
