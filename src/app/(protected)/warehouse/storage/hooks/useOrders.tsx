import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPallets } from "../actions";

export const usePallets = () => {
  // Obtén la instancia de QueryClient proporcionada por el contexto de React Query
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    keyword: "",
    supplier: "",
    orderBy: "",
    orderWay: "",
  });

  const fetchPallets = ({
    page = 1,
    limit = 50,
    keyword = "",
    supplier = "",
    orderBy = "",
    orderWay = "",
  }: {
    page?: number;
    limit?: number;
    keyword?: string;
    supplier?: string;
    orderBy?: string;
    orderWay?: string;
  }) => getPallets({ page, limit, keyword, supplier, orderBy, orderWay });

  const palletsQuery = useQuery({
    queryKey: ["pallets", filters],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        {
          page: number;
          limit: number;
          keyword: string;
          supplier: string;
          orderBy: string;
          orderWay: string;
        }
      ];
      return fetchPallets(params);
    },
    staleTime: 1000 * 60 * 10, // -> 10m
  });

  const filterBySupplier = (supplier_id: number | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      supplier: supplier_id ? supplier_id.toString() : "",
      page: 1,
      limit: 50,
    }));

    queryClient.invalidateQueries({ queryKey: ["pallets"] });
  };

  const filterByKeyword = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: ["pallets"] });
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    palletsQuery,
    filterBySupplier,
    filterByKeyword,
    changePage,
    changeLimit,
    currentPage: filters.page,
    itemsPerPage: filters.limit,
  };
};
