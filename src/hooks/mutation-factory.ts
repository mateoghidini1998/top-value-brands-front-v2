"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Match the server-side error structure
export type SerializableError = {
  name: string;
  message: string;
  status: number;
};

export class HttpError extends Error {
  status: number;
  backendMessage: string;

  constructor(message: string, status: number, backendMessage?: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.backendMessage = backendMessage || message;
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  // Create an HttpError from a serialized error
  static fromSerializable(error: SerializableError): HttpError {
    return new HttpError(error.message, error.status, error.message);
  }
}

interface BaseMutationConfig<T> {
  mutationFn: (variables: T) => Promise<unknown>;
  successMessage?: string;
  errorMessage?: string;
  invalidateKeys?: (string | number)[][];
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
    onError: (error: unknown) => {
      console.log("Error received:", error);

      // Handle different error types
      if (error instanceof HttpError) {
        // Already an HttpError instance
        toast.error(`Error: ${error.backendMessage}`);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        error.name === "HttpError"
      ) {
        // It's a serialized HttpError from the server
        const serializableError = error as SerializableError;
        toast.error(`Error: ${serializableError.message}`);
      } else {
        // Fallback for other error types
        toast.error(config.errorMessage || "An unexpected error occurred");
      }
    },
  });
}
