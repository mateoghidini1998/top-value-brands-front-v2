import { useQuery } from "@tanstack/react-query";
import { getAllPalletProducts } from "../actions/get-pallet-products.action";

export const usePalletProductsQuery = () => {
  const palletProductsQuery = useQuery({
    queryKey: ["pallet-products"],
    queryFn: () => getAllPalletProducts(),
    staleTime: 1000 * 60 * 60 * 24, // -> 1 day
  });

  return {
    palletProductsQuery,
  };
};
