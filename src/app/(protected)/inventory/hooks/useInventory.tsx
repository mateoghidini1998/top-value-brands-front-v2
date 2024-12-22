"use client";

import { getInventory } from "@/app/(protected)/inventory/actions/get-products.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProduct } from "../actions/create-product.action";

export const useInventory = () => {
  const queryClient = useQueryClient();

  const inventoryQuery = useQuery({
    queryKey: [
      "inventory",
      {
        page: 1,
        limit: 50,
        keyword: "",
        supplier: "",
        orderBy: "",
        orderWay: "",
      },
    ],
    queryFn: () =>
      getInventory({
        page: 1,
        limit: 50,
        keyword: "",
        supplier: "",
        orderBy: "",
        orderWay: "",
      }),
    staleTime: 1000 * 60 * 5, // -> 5m
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate the inventory query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    inventoryQuery,
    createProductMutation,
  };
};
