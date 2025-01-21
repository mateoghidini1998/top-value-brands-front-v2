import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "../actions";
export const useSuppliers = () => {
  const suppliersQuery = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => getSuppliers(),
    staleTime: 1000 * 60 * 60 * 24 * 7, // -> 7 days
  });

  return {
    suppliersQuery,
  };
};
