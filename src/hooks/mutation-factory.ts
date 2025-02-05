import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface BaseMutationConfig<T> {
  mutationFn: (variables: T) => Promise<unknown>; // The mutation function
  successMessage?: string; // Optional success message
  errorMessage?: string; // Optional error message
  invalidateKeys?: (string | number)[][]; // Query keys to invalidate on success
}

export function useCreateMutation<T>(config: BaseMutationConfig<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: config.mutationFn,
    onSuccess: () => {
      // Invalidate related queries if specified
      config.invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      // Show success toast if a message is provided
      if (config.successMessage) {
        toast.success(config.successMessage);
      }
    },
    onError: (error) => {
      // Log the error and show an error toast if a message is provided
      console.error(`${config.errorMessage || "Mutation failed"}:`, error);
      if (config.errorMessage) {
        toast.error(config.errorMessage);
      }
    },
  });
}
