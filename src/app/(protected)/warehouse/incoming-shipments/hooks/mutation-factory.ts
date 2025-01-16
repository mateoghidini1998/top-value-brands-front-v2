import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MutationConfig } from "./types";

export function useCreateMutation<T>(config: MutationConfig<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: config.mutationFn,
    onSuccess: () => {
      // Si no se pasan keys específicas, invalida ORDER_SUMMARY y ORDERS por defecto
      const keysToInvalidate = config.invalidateKeys ?? [
        ["ORDER_SUMMARY", config.orderId.toString()],
        ["ORDERS"],
      ];

      // Recorre e invalida cada key
      keysToInvalidate.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      toast.success(config.successMessage);
    },

    onError: (error) => {
      console.error(`${config.errorMessage}:`, error);
      toast.error(config.errorMessage);
    },
  });
}
