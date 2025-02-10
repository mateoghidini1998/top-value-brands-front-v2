"use client";

import { CACHE_TIMES, QUERY_KEYS } from "@/constants";
import { GetShipemntByIDResponse } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getShipmentById } from "../../actions";

export const useShipmentQuery = (shipmentId: string) => {
  return useQuery<GetShipemntByIDResponse>({
    queryKey: [QUERY_KEYS.SHIPMENTS, shipmentId],
    queryFn: () => getShipmentById(shipmentId),
    staleTime: CACHE_TIMES.ONE_HOUR,
  });
};

export const usePrefetchShipmentByID = (shipmentId: string) => {
  const queryClient = useQueryClient();

  const prefetchShipmentByID = () => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.SHIPMENTS, shipmentId],
      queryFn: () => getShipmentById(shipmentId),
      staleTime: CACHE_TIMES.ONE_HOUR,
    });
  };

  return { prefetchShipmentByID };
};
