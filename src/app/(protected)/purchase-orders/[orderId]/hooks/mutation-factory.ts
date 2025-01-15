import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./constants";
import { MutationConfig } from "./types";
import { toast } from "sonner";

// Remove the type constraint since we handle different types of mutations
export function useCreateMutation<T>(config: MutationConfig<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: config.mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORDER_SUMMARY, config.orderId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      toast.success(config.successMessage);
    },

    onError: (error) => {
      console.error(`${config.errorMessage}:`, error);
      toast.error(config.errorMessage);
    },
  });
}
