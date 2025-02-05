"use client";

import { updateOrderStatus } from "../../actions";
import {
  addProductsToOrder,
  updateOrderNotes,
  updateOrderNumber,
  updateOrderProducts,
} from "../actions";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  QUERY_KEYS,
} from "../../../../../constants";
import { useCreateMutation } from "../../../../../hooks/mutation-factory";
import updatePurchaseOrder from "../actions/update-purchase-order.action";

export const useOrderSummaryMutations = (orderId: string) => {
  const updatePOProductsMutation = useCreateMutation({
    mutationFn: updateOrderProducts,
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY, orderId], [QUERY_KEYS.ORDERS]],
  });

  const updatePONotesMutation = useCreateMutation({
    mutationFn: updateOrderNotes,
    errorMessage: ERROR_MESSAGES.UPDATE_NOTES,
    successMessage: SUCCESS_MESSAGES.UPDATE_NOTES,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY, orderId], [QUERY_KEYS.ORDERS]],
  });

  const updatePONumberMutation = useCreateMutation({
    mutationFn: updateOrderNumber,
    errorMessage: ERROR_MESSAGES.UPDATE_NUMBER,
    successMessage: SUCCESS_MESSAGES.UPDATE_NUMBER,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY, orderId], [QUERY_KEYS.ORDERS]],
  });

  const updatePOStatusMutation = useCreateMutation({
    mutationFn: updateOrderStatus,
    errorMessage: ERROR_MESSAGES.UPDATE_STATUS,
    successMessage: SUCCESS_MESSAGES.UPDATE_STATUS,
    // Invalida ORDER_SUMMARY y un filtro de estado de ordenes
    invalidateKeys: [[QUERY_KEYS.ORDERS], [QUERY_KEYS.INCOMING_SHIPMENTS]],
  });

  const addProductsToOrderMutation = useCreateMutation({
    mutationFn: addProductsToOrder,
    errorMessage: ERROR_MESSAGES.ADD_PRODUCT_TO_ORDER,
    successMessage: SUCCESS_MESSAGES.ADD_PRODUCT_TO_ORDER,
    // Invalida ORDER_SUMMARY y un filtro de estado de ordenes
    invalidateKeys: [[QUERY_KEYS.ORDERS], [QUERY_KEYS.ORDER_SUMMARY]],
  });

  const updatePurchaseOrderMutation = useCreateMutation({
    mutationFn: updatePurchaseOrder,
    errorMessage: ERROR_MESSAGES.UPDATE_ORDER,
    successMessage: SUCCESS_MESSAGES.UPDATE_ORDER,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY], [QUERY_KEYS.ORDERS]],
  });

  return {
    updateOrderProducts: updatePOProductsMutation.mutate,
    updateOrderProductsAsync: updatePOProductsMutation.mutateAsync,
    isError: updatePOProductsMutation.isError,
    isSuccess: updatePOProductsMutation.isSuccess,

    updateOrderNotes: updatePONotesMutation.mutate,
    updateOrderNotesAsync: updatePONotesMutation.mutateAsync,

    isErrorNotes: updatePONotesMutation.isError,
    isSuccessNotes: updatePONotesMutation.isSuccess,

    updateOrderNumber: updatePONumberMutation.mutate,
    updateOrderNumberAsync: updatePONumberMutation.mutateAsync,

    isErrorNumber: updatePONumberMutation.isError,
    isSuccessNumber: updatePONumberMutation.isSuccess,

    updateOrderStatus: updatePOStatusMutation.mutate,
    updateOrderStatusAsync: updatePOStatusMutation.mutateAsync,

    isErrorStatus: updatePOStatusMutation.isError,
    isSuccessStatus: updatePOStatusMutation.isSuccess,

    addProductsToOrder: addProductsToOrderMutation.mutate,
    addProductsToOrderAsync: addProductsToOrderMutation.mutateAsync,

    isErrorProducts: addProductsToOrderMutation.isError,
    isSuccessProducts: addProductsToOrderMutation.isSuccess,

    updatePurchaseOrder: updatePurchaseOrderMutation.mutate,
    updatePurchaseOrderAsync: updatePurchaseOrderMutation.mutateAsync,
    isErrorOrder: updatePurchaseOrderMutation.isError,
    isSuccessOrder: updatePurchaseOrderMutation.isSuccess,
  };
};
