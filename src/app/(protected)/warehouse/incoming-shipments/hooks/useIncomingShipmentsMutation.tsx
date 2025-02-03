"use client";
import { createPallet } from "../actions/create-pallet.action";
import updateIncomingOrderProducts from "../actions/update-incoming-shipment-product.action";
import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "./constants";
import { useCreateMutation } from "./mutation-factory";

export const useIncomingShipmentsMutations = (orderId: string) => {
  const updateIncomingOrderProductsMutation = useCreateMutation({
    mutationFn: updateIncomingOrderProducts,
    orderId: Number(orderId),
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
    invalidateKeys: [
      [QUERY_KEYS.ORDER_SUMMARY, orderId],
      [QUERY_KEYS.INCOMING_SHIPMENTS],
    ],
  });

  const createPalletMutation = useCreateMutation({
    mutationFn: createPallet,
    orderId: Number(orderId),
    errorMessage: ERROR_MESSAGES.CREATE_PALLET,
    successMessage: SUCCESS_MESSAGES.CREATE_PALLET,
    invalidateKeys: [
      [QUERY_KEYS.ORDER_SUMMARY, orderId],
      [QUERY_KEYS.ORDERS],
      [QUERY_KEYS.PALLETS],
      [QUERY_KEYS.PALLET_PRODUCTS],
      [QUERY_KEYS.WAREHOUSE_LOCATIONS],
    ],
  });

  return {
    updateIncomingOrderProducts: updateIncomingOrderProductsMutation.mutate,
    updateOrderProductsAsync: updateIncomingOrderProductsMutation.mutateAsync,
    isError: updateIncomingOrderProductsMutation.isError,
    isSuccess: updateIncomingOrderProductsMutation.isSuccess,

    createPallet: createPalletMutation.mutate,
    createPalletAsync: createPalletMutation.mutateAsync,
    isErrorPallet: createPalletMutation.isError,
    isSuccessPallet: createPalletMutation.isSuccess,
  };
};
