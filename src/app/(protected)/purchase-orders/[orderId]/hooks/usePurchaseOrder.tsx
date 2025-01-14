"use client";

import { useQuery } from "@tanstack/react-query";
import { GetPurchaseOrderSummaryResponse } from "../../interfaces/orders.interface";
import { getPurchaseOrderSummary } from "../actions/get-purchase-order.action";
import updateOrderProducts from "../actions/update-order-products.action";
import updateOrderNotes from "../actions/update-purchase-order-notes.action";
import updateOrderNumber from "../actions/update-order-number.action";
import {
  CACHE_TIMES,
  ERROR_MESSAGES,
  QUERY_KEYS,
  SUCCESS_MESSAGES,
} from "./constants";
import { createMutation } from "./mutation-factory";
import { PurchaseOrderHookResult } from "./types";

export const usePurchaseOrder = (orderId: string): PurchaseOrderHookResult => {
  // Query for fetching purchase order data
  const purchaseOrderQuery = useQuery<GetPurchaseOrderSummaryResponse>({
    queryKey: [QUERY_KEYS.PURCHASE_ORDER, orderId],
    queryFn: () => getPurchaseOrderSummary({ orderId }),
    staleTime: CACHE_TIMES.ONE_HOUR,
  });

  // Mutations for updating different aspects of the purchase order
  const updatePOProductsMutation = createMutation({
    mutationFn: updateOrderProducts,
    orderId: Number(orderId), // Convert to number for the products mutation
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
  });

  const updatePONotesMutation = createMutation({
    mutationFn: updateOrderNotes,
    orderId,
    errorMessage: ERROR_MESSAGES.UPDATE_NOTES,
    successMessage: SUCCESS_MESSAGES.UPDATE_NOTES,
  });

  const updatePONumberMutation = createMutation({
    mutationFn: updateOrderNumber,
    orderId,
    errorMessage: ERROR_MESSAGES.UPDATE_NUMBER,
    successMessage: SUCCESS_MESSAGES.UPDATE_NUMBER,
  });

  return {
    // Query results
    data: purchaseOrderQuery.data,
    isLoading: purchaseOrderQuery.isLoading,
    error: purchaseOrderQuery.error as Error | null,

    // Products mutation
    updateOrderProducts: updatePOProductsMutation.mutate,
    updateOrderProductsAsync: updatePOProductsMutation.mutateAsync,
    isError: updatePOProductsMutation.isError,
    isSuccess: updatePOProductsMutation.isSuccess,

    // Notes mutation
    updateOrderNotes: updatePONotesMutation.mutate,
    updateOrderNotesAsync: updatePONotesMutation.mutateAsync,
    isErrorNotes: updatePONotesMutation.isError,
    isSuccessNotes: updatePONotesMutation.isSuccess,

    // Order number mutation
    updateOrderNumber: updatePONumberMutation.mutate,
    updateOrderNumberAsync: updatePONumberMutation.mutateAsync,
    isErrorNumber: updatePONumberMutation.isError,
    isSuccessNumber: updatePONumberMutation.isSuccess,
  };
};
