import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPallets, GetPalletById } from "../actions";
import { toast } from "sonner";
import { deletePallet } from "../actions/delete-pallet.action";

export const usePallets = (palletId?: string) => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    keyword: "",
    pallet_number: "",
    orderBy: "",
    orderWay: "",
  });

  const fetchPallets = ({
    page = 1,
    limit = 50,
    keyword = "",
    pallet_number = "",
    orderBy = "",
    orderWay = "",
  }: {
    page?: number;
    limit?: number;
    keyword?: string;
    pallet_number?: string;
    orderBy?: string;
    orderWay?: string;
  }) => getPallets({ page, limit, keyword, pallet_number, orderBy, orderWay });

  const palletsQuery = useQuery({
    queryKey: ["pallets", filters],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        {
          page: number;
          limit: number;
          keyword: string;
          pallet_number: string;
          orderBy: string;
          orderWay: string;
        }
      ];
      return fetchPallets(params);
    },
    staleTime: 1000 * 60 * 10,
  });

  // Query para obtener un pallet por ID
  const palletByIdQuery = useQuery({
    queryKey: ["pallet", palletId],
    queryFn: () => GetPalletById({ palletId: palletId! }),
    staleTime: 1000 * 60 * 10,
    enabled: !!palletId,
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

  const filterByPalletNumber = (pallet_number: string) => {
    setFilters((prev) => ({ ...prev, pallet_number, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: ["pallets"] });
  };

  const orderBy = (orderBy: string) => {
    // If the orderBy parameter is the same as the current orderBy, toggle the orderWay
    if (orderBy === filters.orderBy) {
      setFilters((prev) => ({
        ...prev,
        orderWay: prev.orderWay === "asc" ? "desc" : "asc",
      }));
    } else {
      // If the orderBy parameter is different from the current orderBy, set the orderWay to "asc"
      setFilters((prev) => ({ ...prev, orderWay: "asc" }));
    }

    setFilters((prev) => ({ ...prev, orderBy }));
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const deletePalletMutation = useMutation({
    mutationFn: (palletId: number) => deletePallet({ palletId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pallets"] });
    },
    onError(error: Error) {
      console.error(error);
      toast.error(error.message);
    },
  });

  return {
    palletsQuery,
    palletByIdQuery,
    filterBySupplier,
    filterByPalletNumber,
    orderBy,
    changePage,
    changeLimit,
    deletePalletMutation,
    currentPage: filters.page,
    itemsPerPage: filters.limit,
  };
};
