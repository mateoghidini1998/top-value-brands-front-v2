import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "../actions";
import { QUERY_KEYS } from "@/constants";
export const useSuppliers = () => {
  const suppliersQuery = useQuery({
    queryKey: [QUERY_KEYS.SUPPLIERS],
    queryFn: () => getSuppliers(),
    staleTime: 1000 * 60 * 60 * 24 * 7, // -> 7 days
  });

  return {
    suppliersQuery,
  };
};
