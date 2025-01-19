"use client";

import { useCreateMutation } from "@/hooks/mutation-factory";
import { createShipment } from "../actions/create-shipment.action";
import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/app/constants";

export const useShipmentMutations = () => {
  const createShipmentMutation = useCreateMutation({
    mutationFn: createShipment,
    errorMessage: ERROR_MESSAGES.CREATE_SHIPMENT,
    successMessage: SUCCESS_MESSAGES.CREATE_SHIPMENT,
    invalidateKeys: [[QUERY_KEYS.SHIPMENTS], [QUERY_KEYS.PALLETS]],
  });

  return {
    createShipment: createShipmentMutation.mutate,
    createShipmentAsync: createShipmentMutation.mutateAsync,
    isErrorShipment: createShipmentMutation.isError,
    isSuccessShipment: createShipmentMutation.isSuccess,
  };
};
