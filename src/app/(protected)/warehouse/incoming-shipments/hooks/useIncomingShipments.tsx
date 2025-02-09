import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getIncomingShipments } from "../actions";
import { toast } from "sonner";
import { serviceFactory } from "@/services";

export const useIncomingShipments = () => {
  const purchaseOrderService = serviceFactory.getPurchaseOrderService();

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

  const fetchIncomingShipments = ({
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
  }) =>
    getIncomingShipments({ page, limit, keyword, supplier, orderBy, orderWay });

  const ordersQuery = useQuery({
    queryKey: ["incoming-shipments", filters],
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
      return fetchIncomingShipments(params);
    },
    staleTime: 1000 * 60 * 10, // -> 10m
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: number) =>
      purchaseOrderService.deleteOrder({ orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incoming-shipments"] });
    },
    onError(error: Error) {
      console.error(error);
      toast.error(error.message);
    },
  });

  const filterBySupplier = (supplier_id: string | number | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      supplier: supplier_id ? supplier_id.toString() : "",
      page: 1,
      limit: 50,
    }));

    queryClient.invalidateQueries({ queryKey: ["incoming-shipments"] });
  };

  const filterByKeyword = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: ["incoming-shipments"] });
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    ordersQuery,
    filterBySupplier,
    filterByKeyword,
    changePage,
    changeLimit,
    currentPage: filters.page,
    itemsPerPage: filters.limit,

    deleteOrderMutation,
  };
};
