import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Make MutationConfig more flexible by not constraining the generic type
interface BaseMutationConfig<T> {
  mutationFn: (variables: T) => Promise<unknown>;
  successMessage: string;
  errorMessage: string;
  invalidateKeys?: (string | number)[][];
}

interface MutationConfigOrders<T> extends BaseMutationConfig<T> {
  orderId: number | string;
}

type MutationConfig<T> = BaseMutationConfig<T> | MutationConfigOrders<T>;

export function useCreateMutation<T>(config: MutationConfig<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: config.mutationFn,
    onSuccess: () => {
      // Invalidar claves relacionadas tras eliminar
      config.invalidateKeys?.forEach((key) => {
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
