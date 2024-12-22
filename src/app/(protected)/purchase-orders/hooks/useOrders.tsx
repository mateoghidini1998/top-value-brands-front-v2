import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createOrder } from "../actions/create-order.action";
import { getOrders } from "../actions/get-orders.action";

export const useOrders = () => {
  const queryClient = new QueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
    staleTime: 1000 * 60 * 5, // -> 5m
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate the orders query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    ordersQuery,
    createOrderMutation,
  };
};
