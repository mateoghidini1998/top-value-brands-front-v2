import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/constants";
import { useCreateMutation } from "@/hooks/mutation-factory";
import { serviceFactory } from "@/services";
import { UpdateIncomingOrderProductsProps } from "@/types/incoming-orders/update.types";
import {
  GetOrdersProps,
  GetPurchaseOrdersResponse,
} from "@/types/purchase-orders";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const incomingOrderService = serviceFactory.getIncomingOrderService();

export const useGetAllIncomingOrders = (initialParams: GetOrdersProps) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<GetOrdersProps>(initialParams);

  const { data, isLoading, isError, error, refetch } = useQuery<
    GetPurchaseOrdersResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.INCOMING_SHIPMENTS, filters],
    queryFn: () => incomingOrderService.getIncomingOrders(filters),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filterBySupplier = (supplier_id: number | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      supplier: supplier_id ? supplier_id.toString() : "",
      page: 1,
      limit: 50,
    }));
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.INCOMING_SHIPMENTS],
    });
  };

  const filterByStatus = (status_id: number | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: status_id ? status_id.toString() : "",
      page: 1,
      limit: 50,
    }));
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.INCOMING_SHIPMENTS],
    });
  };

  const filterByKeyword = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.INCOMING_SHIPMENTS],
    });
  };

  const orderBy = (orderBy: string) => {
    setFilters((prev) => {
      const newOrderWay =
        orderBy === prev.orderBy
          ? prev.orderWay === "ASC"
            ? "DESC"
            : "ASC"
          : "DESC";
      return { ...prev, orderBy, orderWay: newOrderWay };
    });
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    incomingOrdersResponse: data,
    incomingOrdersIsLoading: isLoading,
    incomingOrdersIsError: isError,
    incomingOrdersErrorMessage: error?.message,
    incomingOrdersRefetch: refetch,
    filterBySupplier,
    filterByStatus,
    filterByKeyword,
    orderBy,
    changePage,
    changeLimit,
    currentPage: filters.page || 1,
    itemsPerPage: filters.limit || 50,
  };
};

export const useUpdateIncomingOrderProducts = () => {
  const updateIncomingOrderProducts =
    useCreateMutation<UpdateIncomingOrderProductsProps>({
      mutationFn: (props: UpdateIncomingOrderProductsProps) =>
        incomingOrderService.updateIncomingOrderProducts(props),
      successMessage: SUCCESS_MESSAGES.UPDATE_ORDER_PRODUCTS,
      errorMessage: ERROR_MESSAGES.UPDATE_ORDER_PRODUCTS,
      invalidateKeys: [
        [QUERY_KEYS.INCOMING_SHIPMENTS],
        [QUERY_KEYS.ORDER_SUMMARY],
      ],
    });

  return {
    updateIncomingOrderProductsAsync: updateIncomingOrderProducts.mutateAsync,
    isUpdatingIncomingOrderProductsError: updateIncomingOrderProducts.isError,
    isUpdatingIncomingOrderProductsSuccess:
      updateIncomingOrderProducts.isSuccess,
    isUpdatingIncomingOrderProducts: updateIncomingOrderProducts.isPending,
  };
};
