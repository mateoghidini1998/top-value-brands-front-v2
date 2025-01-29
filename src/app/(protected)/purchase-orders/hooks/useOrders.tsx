import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { createOrder, deleteOrder, downloadPDF, getOrders } from "../actions";

export const useOrders = () => {
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

  const fetchOrders = ({
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
  }) => getOrders({ page, limit, keyword, supplier, orderBy, orderWay });

  const ordersQuery = useQuery({
    queryKey: ["orders", filters],
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
      return fetchOrders(params);
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

    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  const filterByKeyword = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
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
    // queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate the orders query para obtener la lista actualizada
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: number) => deleteOrder({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError(error: Error) {
      console.error(error);
      toast.error(error.message);
    },
  });

  return {
    ordersQuery,
    createOrderMutation,
    filterBySupplier,
    filterByKeyword,
    orderBy,
    changePage,
    changeLimit,
    currentPage: filters.page,
    itemsPerPage: filters.limit,
    deleteOrderMutation,
    downloadPDF,
  };
};
