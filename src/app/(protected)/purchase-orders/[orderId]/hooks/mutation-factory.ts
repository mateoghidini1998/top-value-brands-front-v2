import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./constants";
import { MutationConfig } from "./types";

export function createMutation<T extends { orderId: string }>(
  config: MutationConfig<T>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: config.mutationFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PURCHASE_ORDER, variables.orderId],
      });
    },
    onError: (error) => {
      console.error(`${config.errorMessage}:`, error);
    },
  });
}
