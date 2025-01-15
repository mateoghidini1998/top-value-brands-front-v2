"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CACHE_TIMES,
  ERROR_MESSAGES,
  QUERY_KEYS,
  SUCCESS_MESSAGES,
} from "./constants";
import { PurchaseOrderHookResult } from "./types";
import {
  getPurchaseOrderSummary,
  updateOrderNotes,
  updateOrderNumber,
  updateOrderProducts,
} from "../actions";
import { useCreateMutation } from "./mutation-factory";
import { GetPurchaseOrderSummaryResponse } from "@/types";
import { updateOrderStatus } from "../../actions";

export const usePurchaseOrder = (orderId: string): PurchaseOrderHookResult => {
  // Query for fetching purchase order data
  const purchaseOrderQuery = useQuery<GetPurchaseOrderSummaryResponse>({
    queryKey: [QUERY_KEYS.ORDER_SUMMARY, orderId],
    queryFn: () => getPurchaseOrderSummary({ orderId }),
    staleTime: CACHE_TIMES.ONE_HOUR,
  });

  // Mutations for updating different aspects of the purchase order
  const updatePOProductsMutation = useCreateMutation({
    mutationFn: updateOrderProducts,
    orderId: Number(orderId), // Convert to number for the products mutation
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
  });

  const updatePONotesMutation = useCreateMutation({
    mutationFn: updateOrderNotes,
    orderId,
    errorMessage: ERROR_MESSAGES.UPDATE_NOTES,
    successMessage: SUCCESS_MESSAGES.UPDATE_NOTES,
  });

  const updatePONumberMutation = useCreateMutation({
    mutationFn: updateOrderNumber,
    orderId,
    errorMessage: ERROR_MESSAGES.UPDATE_NUMBER,
    successMessage: SUCCESS_MESSAGES.UPDATE_NUMBER,
  });

  const updatePOStatusMutation = useCreateMutation({
    mutationFn: updateOrderStatus,
    orderId,
    errorMessage: ERROR_MESSAGES.UPDATE_STATUS,
    successMessage: SUCCESS_MESSAGES.UPDATE_STATUS,
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

    // Order status mutation
    updateOrderStatus: updatePOStatusMutation.mutate,
    updateOrderStatusAsync: updatePOStatusMutation.mutateAsync,
    isErrorStatus: updatePOStatusMutation.isError,
    isSuccessStatus: updatePOStatusMutation.isSuccess,
  };
};
