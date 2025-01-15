"use client";

import { updateOrderStatus } from "../../actions";
import {
  updateOrderNotes,
  updateOrderNumber,
  updateOrderProducts,
} from "../actions";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "./constants";
import { useCreateMutation } from "./mutation-factory";

export const useOrderSummaryMutations = (orderId: string) => {
  const updatePOProductsMutation = useCreateMutation({
    mutationFn: updateOrderProducts,
    orderId: Number(orderId),
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
    // Productos
    updateOrderProducts: updatePOProductsMutation.mutate,
    updateOrderProductsAsync: updatePOProductsMutation.mutateAsync,
    isError: updatePOProductsMutation.isError,
    isSuccess: updatePOProductsMutation.isSuccess,

    // Notas
    updateOrderNotes: updatePONotesMutation.mutate,
    updateOrderNotesAsync: updatePONotesMutation.mutateAsync,
    isErrorNotes: updatePONotesMutation.isError,
    isSuccessNotes: updatePONotesMutation.isSuccess,

    // Número de Orden
    updateOrderNumber: updatePONumberMutation.mutate,
    updateOrderNumberAsync: updatePONumberMutation.mutateAsync,
    isErrorNumber: updatePONumberMutation.isError,
    isSuccessNumber: updatePONumberMutation.isSuccess,

    // Estado
    updateOrderStatus: updatePOStatusMutation.mutate,
    updateOrderStatusAsync: updatePOStatusMutation.mutateAsync,
    isErrorStatus: updatePOStatusMutation.isError,
    isSuccessStatus: updatePOStatusMutation.isSuccess,
  };
};
