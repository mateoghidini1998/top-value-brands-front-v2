import { QUERY_KEYS } from "@/constants";
import { serviceFactory } from "@/services";
import { useQuery } from "@tanstack/react-query";

const warehouseLocationsService = serviceFactory.getWarehouseLocationsService();

export const useWarehouseAvailableLocations = () => {
  const getWarehouseAvailableLocations = useQuery({
    queryKey: [QUERY_KEYS.WAREHOUSE_AVAILABLE_LOCATIONS],
    queryFn: () => warehouseLocationsService.GetWarehouseLocations(true),
    staleTime: 1000 * 60 * 60 * 24 * 7, // -> 7 days
  });

  return {
    getWarehouseAvailableLocations: getWarehouseAvailableLocations,
  };
};

export const useWarehouseUnavailableLocations = () => {
  const getWarehouseUnavailableLocations = useQuery({
    queryKey: [QUERY_KEYS.WAREHOUSE_UNAVAILABLE_LOCATIONS],
    queryFn: () => warehouseLocationsService.GetWarehouseLocations(false),
    staleTime: 1000 * 60 * 60 * 24 * 7, // -> 7 days
  });

  return {
    getWarehouseUnavailableLocations: getWarehouseUnavailableLocations,
  };
};
