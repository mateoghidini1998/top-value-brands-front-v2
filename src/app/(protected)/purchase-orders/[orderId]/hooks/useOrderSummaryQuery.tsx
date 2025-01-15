"use client";

import { useQuery } from "@tanstack/react-query";
import { CACHE_TIMES, QUERY_KEYS } from "./constants";
import { GetPurchaseOrderSummaryResponse } from "@/types";
import { getPurchaseOrderSummary } from "../actions";

export const useOrderSummaryQuery = (orderId: string, enabled = true) => {
  return useQuery<GetPurchaseOrderSummaryResponse>({
    queryKey: [QUERY_KEYS.ORDER_SUMMARY, orderId],
    queryFn: () => getPurchaseOrderSummary({ orderId }),
    staleTime: CACHE_TIMES.ONE_HOUR,
    enabled, // Permite activar/desactivar la consulta
  });
};
