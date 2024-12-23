import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "../actions/get-suppliers.action";
export const useSuppliers = () => {
  const suppliersQuery = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => getSuppliers(),
    staleTime: 1000 * 60 * 60 * 24, // -> 1 day
  });

  return {
    suppliersQuery,
  };
};
