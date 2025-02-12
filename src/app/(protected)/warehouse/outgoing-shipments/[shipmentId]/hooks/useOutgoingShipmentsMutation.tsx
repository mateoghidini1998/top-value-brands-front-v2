"use client";

import { useCreateMutation } from "@/hooks/mutation-factory";
import checkProductShipment from "../../actions/check-shipment-product";
import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/constants";

export const useOutgoingShipmentsMutations = () => {
  const checkShipmentProductMutation = useCreateMutation({
    mutationFn: checkProductShipment,
    errorMessage: ERROR_MESSAGES.CHECK_SHIPMENT_PRODUCT,
    successMessage: SUCCESS_MESSAGES.CHECK_SHIPMENT_PRODUCT,
    invalidateKeys: [
      [QUERY_KEYS.SHIPMENTS],
      [QUERY_KEYS.WAREHOUSE_AVAILABLE_LOCATIONS],
      [QUERY_KEYS.PALLET_PRODUCTS],
      [QUERY_KEYS.PALLETS],
      [QUERY_KEYS.PALLET],
    ],
  });

  return {
    checkShipmentProduct: checkShipmentProductMutation.mutate,
    checkShipmentProductAsync: checkShipmentProductMutation.mutateAsync,
    isError: checkShipmentProductMutation.isError,
    isSuccess: checkShipmentProductMutation.isSuccess,
  };
};
