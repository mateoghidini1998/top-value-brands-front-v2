import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MutationConfig } from "./types";

export function useDeleteMutation<T>(config: MutationConfig<T>) {
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
