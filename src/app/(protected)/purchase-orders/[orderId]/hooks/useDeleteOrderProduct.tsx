import { deleteOrderProduct } from "../actions";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, QUERY_KEYS } from "./constants";
import { useDeleteMutation } from "./delete-mutation-factory";

export const useDeleteOrderProduct = (orderProductId: string) => {
  const deleteOrderProductMutation = useDeleteMutation({
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
