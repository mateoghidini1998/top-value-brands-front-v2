"use client";

import { useQuery } from "@tanstack/react-query";
import { getPurchaseOrderSummary } from "../actions/get-purchase-order.action";
import { GetPurchaseOrderSummaryResponse } from "../../interfaces/orders.interface";
export const usePurchaseOrder = (orderId: string) => {
  const purchaseOrderQuery = useQuery<GetPurchaseOrderSummaryResponse>({
    queryKey: ["purchase-order", orderId],
    queryFn: () => getPurchaseOrderSummary({ orderId }),
    staleTime: 1000 * 60 * 60 * 1, // -> 1 hour
  });

  return {
    purchaseOrderQuery,
    data: purchaseOrderQuery.data?.data,
    isLoading: purchaseOrderQuery.isLoading,
    error: purchaseOrderQuery.error,
  };
};
