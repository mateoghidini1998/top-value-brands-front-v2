"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPurchaseOrderSummaryResponse } from "../../interfaces/orders.interface";
import { getPurchaseOrderSummary } from "../actions/get-purchase-order.action";
import updateOrderProducts, {
  UpdateOrderProductsProps,
} from "../actions/update-order-products.action";
export const usePurchaseOrder = (orderId: string) => {
  const queryClient = useQueryClient();

  const purchaseOrderQuery = useQuery<GetPurchaseOrderSummaryResponse>({
    queryKey: ["purchase-order", orderId],
    queryFn: () => getPurchaseOrderSummary({ orderId }),
    staleTime: 1000 * 60 * 60 * 1, // -> 1 hour
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateOrderProductsProps) => updateOrderProducts(data),
    onSuccess: (_, { orderId }) => {
      // Invalida la cache para refrescar los datos actualizados
      queryClient.invalidateQueries({ queryKey: ["purchase-order", orderId] });
    },
    onError: (error) => {
      console.error("Error al actualizar los productos:", error);
    },
  });

  return {
    purchaseOrderQuery,
    data: purchaseOrderQuery.data,
    isLoading: purchaseOrderQuery.isLoading,
    error: purchaseOrderQuery.error,
    updateOrderProducts: mutation.mutate,
    updateOrderProductsAsync: mutation.mutateAsync,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
};
