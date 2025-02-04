import { deleteOrderProduct } from "../actions";
import { useCreateMutation } from "../../../../../hooks/mutation-factory";
import {
  ERROR_MESSAGES,
  QUERY_KEYS,
  SUCCESS_MESSAGES,
} from "../../../../../constants";
export const useDeleteOrderProduct = (orderProductId: string) => {
  const deleteOrderProductMutation = useCreateMutation({
    mutationFn: deleteOrderProduct,
    orderId: Number(orderProductId),
    errorMessage: ERROR_MESSAGES.DELETE_ORDER_PRODUCT,
    successMessage: SUCCESS_MESSAGES.DELETE_ORDER_PRODUCT,
    invalidateKeys: [
      [QUERY_KEYS.ORDER_SUMMARY], // Refresca el resumen de la orden
      [QUERY_KEYS.ORDERS], // Refresca todas las órdenes
    ],
  });

  return {
    deleteOrderProductMutation,
  };
};
