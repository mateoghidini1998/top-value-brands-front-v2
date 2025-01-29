import { QUERY_KEYS } from "@/app/constants";
import { useQuery } from "@tanstack/react-query";
import { getWarehouseLocations } from "../actions/get-warehouse-location.action";

export const useWarehouseLocations = () => {
  const warehouseLocationsQuery = useQuery({
    queryKey: [QUERY_KEYS.WAREHOUSE_LOCATIONS],
    queryFn: () => getWarehouseLocations(),
    staleTime: 1000 * 60 * 60 * 24 * 7, // -> 7 days
  });

  return {
    warehouseLocationsQuery,
  };
};
