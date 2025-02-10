import { QUERY_KEYS } from "@/constants";
import { serviceFactory } from "@/services";
import { useQuery } from "@tanstack/react-query";

const warehouseLocationsService = serviceFactory.getWarehouseLocationsService();

export const useWarehouseLocations = (available: boolean = true) => {
  const getWarehouseLocations = useQuery({
    queryKey: [QUERY_KEYS.WAREHOUSE_LOCATIONS],
    queryFn: () => warehouseLocationsService.GetWarehouseLocations(available),
    staleTime: 1000 * 60 * 60 * 24 * 7, // -> 7 days
  });

  return {
    getWarehouseLocations,
  };
};
