"use client";

import { updateOrderStatus } from "../../actions";
import {
  updateOrderNotes,
  updateOrderNumber,
  updateOrderProducts,
} from "../actions";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "./constants";
import { useCreateMutation } from "./mutation-factory";
import { QUERY_KEYS } from "./constants";

export const useOrderSummaryMutations = (orderId: string) => {
  const updatePOProductsMutation = useCreateMutation({
    mutationFn: updateOrderProducts,
    orderId: Number(orderId),
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY, orderId], [QUERY_KEYS.ORDERS]],
  });

  const updatePONotesMutation = useCreateMutation({
    mutationFn: updateOrderNotes,
    orderId,
    errorMessage: ERROR_MESSAGES.UPDATE_NOTES,
    successMessage: SUCCESS_MESSAGES.UPDATE_NOTES,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY, orderId], [QUERY_KEYS.ORDERS]],
  });

  const updatePONumberMutation = useCreateMutation({
    mutationFn: updateOrderNumber,
    orderId,
    errorMessage: ERROR_MESSAGES.UPDATE_NUMBER,
    successMessage: SUCCESS_MESSAGES.UPDATE_NUMBER,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY, orderId], [QUERY_KEYS.ORDERS]],
  });

  const updatePOStatusMutation = useCreateMutation({
    mutationFn: updateOrderStatus,
    orderId,
    errorMessage: ERROR_MESSAGES.UPDATE_STATUS,
    successMessage: SUCCESS_MESSAGES.UPDATE_STATUS,
    // Invalida ORDER_SUMMARY y un filtro de estado de ordenes
    invalidateKeys: [[QUERY_KEYS.ORDERS], [QUERY_KEYS.INCOMING_SHIPMENTS]],
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
  };
};
