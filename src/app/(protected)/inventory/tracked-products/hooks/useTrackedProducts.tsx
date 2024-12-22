"use client";

import { useQuery } from "@tanstack/react-query";
import { getTrackedProducts } from "../actions/get-tracked-products.action";

export const useTrackedProducts = () => {
  const trackedProductsQuery = useQuery({
    queryKey: ["tracked-products"],
    queryFn: () => getTrackedProducts(),
    staleTime: 1000 * 60 * 5, // -> 5m
  });

  return {
    trackedProductsQuery,
  };
};
