import { apiRequest } from "@/helpers/http.adapter";
import { GetPurchaseOrderSummaryResponse } from "../../interfaces/orders.interface";

export const getPurchaseOrderSummary = async (props: {
  orderId: string;
}): Promise<GetPurchaseOrderSummaryResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/purchaseorders/summary/${props.orderId}`;
  return await apiRequest<GetPurchaseOrderSummaryResponse>(url);
};
