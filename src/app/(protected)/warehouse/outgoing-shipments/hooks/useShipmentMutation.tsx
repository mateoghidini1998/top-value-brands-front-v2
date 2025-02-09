"use client";

import { useCreateMutation } from "@/hooks/mutation-factory";
import { createShipment } from "../actions/create-shipment.action";
import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/constants";
import { deleteShipment } from "../actions";

export const useShipmentMutations = () => {
  const createShipmentMutation = useCreateMutation({
    mutationFn: createShipment,
    errorMessage: ERROR_MESSAGES.CREATE_SHIPMENT,
    successMessage: SUCCESS_MESSAGES.CREATE_SHIPMENT,
    invalidateKeys: [
      [QUERY_KEYS.SHIPMENTS],
      [QUERY_KEYS.PALLET],
      [QUERY_KEYS.PALLET_PRODUCTS],
    ],
  });

  const deleteShipmentMutation = useCreateMutation({
    mutationFn: deleteShipment,
    errorMessage: ERROR_MESSAGES.DELETE_SHIPMENT,
    successMessage: SUCCESS_MESSAGES.DELETE_SHIPMENT,
    invalidateKeys: [
      [QUERY_KEYS.SHIPMENTS],
      [QUERY_KEYS.PALLET],
      [QUERY_KEYS.PALLET_PRODUCTS],
    ],
  });

  return {
    createShipment: createShipmentMutation.mutate,
    createShipmentAsync: createShipmentMutation.mutateAsync,
    isErrorShipment: createShipmentMutation.isError,
    isSuccessShipment: createShipmentMutation.isSuccess,
    isLoadingCreateShipment: createShipmentMutation.isPending, // Agregado

    deleteShipment: deleteShipmentMutation.mutate,
    deleteShipmentAsync: deleteShipmentMutation.mutateAsync,
    isErrorDeleteShipment: deleteShipmentMutation.isError,
    isSuccessDeleteShipment: deleteShipmentMutation.isSuccess,
    isLoadingDeleteShipment: deleteShipmentMutation.isPending, // Agregado
  };
};
