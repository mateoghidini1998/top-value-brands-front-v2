import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../actions/create-order.action";
import { getOrders } from "../actions/get-orders.action";

export const useOrders = () => {
  // Obtén la instancia de QueryClient proporcionada por el contexto de React Query
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
    staleTime: 1000 * 60 * 15, // -> 15m
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate the orders query para obtener la lista actualizada
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    ordersQuery,
    createOrderMutation,
  };
};
