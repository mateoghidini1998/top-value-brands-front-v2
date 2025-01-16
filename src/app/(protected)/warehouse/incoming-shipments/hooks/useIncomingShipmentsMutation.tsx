"use client";
import updateIncomingOrderProducts from "../actions/update-incoming-shipment-product.action";
import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "./constants";
import { useCreateMutation } from "./mutation-factory";

export const useIncomingShipmentsMutations = (orderId: string) => {
  const updateIncomingOrderProductsMutation = useCreateMutation({
    mutationFn: updateIncomingOrderProducts,
    orderId: Number(orderId),
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY, orderId], [QUERY_KEYS.ORDERS]],
  });

  return {
    updateIncomingOrderProducts: updateIncomingOrderProductsMutation.mutate,
    updateOrderProductsAsync: updateIncomingOrderProductsMutation.mutateAsync,
    isError: updateIncomingOrderProductsMutation.isError,
    isSuccess: updateIncomingOrderProductsMutation.isSuccess,
  };
};
