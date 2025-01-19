"use client";

import { CACHE_TIMES, QUERY_KEYS } from "@/app/constants";
import { GetShipemntByIDResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getShipmentById } from "../../actions";

export const useShipmentQuery = (shipmentId: string) => {
  return useQuery<GetShipemntByIDResponse>({
    queryKey: [QUERY_KEYS.SHIPMENTS, shipmentId],
    queryFn: () => getShipmentById(shipmentId),
    staleTime: CACHE_TIMES.ONE_HOUR,
  });
};
