import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getShipments } from "../actions";

export const useShipmentsQuery = () => {
  // Obtén la instancia de QueryClient proporcionada por el contexto de React Query
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    keyword: "",
    status: "",
    orderBy: "",
    orderWay: "",
  });

  const fetchShipments = ({
    page = 1,
    limit = 50,
    keyword = "",
    status = "",
    orderBy = "",
    orderWay = "",
  }: {
    page?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    orderBy?: string;
    orderWay?: string;
  }) => getShipments({ page, limit, keyword, status, orderBy, orderWay });

  const shipmentsQuery = useQuery({
    queryKey: ["shipments", filters],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [
        string,
        {
          page: number;
          limit: number;
          keyword: string;
          status: string;
          orderBy: string;
          orderWay: string;
        }
      ];
      return fetchShipments(params);
    },
    staleTime: 1000 * 60 * 10, // -> 10m
  });

  const filterByStatus = (status: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: status ? status.toString() : "",
      page: 1,
      limit: 50,
    }));

    queryClient.invalidateQueries({ queryKey: ["shipments"] });
  };

  const filterByKeyword = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: ["shipments"] });
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
      setFilters((prev) => ({ ...prev, orderWay: "desc" }));
    }

    setFilters((prev) => ({ ...prev, orderBy }));
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    shipmentsQuery,
    filterByStatus,
    filterByKeyword,
    orderBy,
    changePage,
    changeLimit,
    currentPage: filters.page,
    itemsPerPage: filters.limit,
  };
};
