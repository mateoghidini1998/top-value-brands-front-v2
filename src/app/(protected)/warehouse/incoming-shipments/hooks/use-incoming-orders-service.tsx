import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/constants";
import { useCreateMutation } from "@/hooks/mutation-factory";
import { serviceFactory } from "@/services";
import { UpdateProductDGType } from "@/types";
import { UpdateIncomingOrderProductsProps } from "@/types/incoming-orders/update.types";
import {
  GetOrdersProps,
  GetPurchaseOrdersResponse,
  UpdateOrderNotesProps,
} from "@/types/purchase-orders";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const incomingOrderService = serviceFactory.getIncomingOrderService();
const InventoryService = serviceFactory.getInventoryService();

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

export const usePrefetchGetIncomingOrders = () => {
  const queryClient = useQueryClient();

  const prefetchGetIncomingOrders = (initialParams: GetOrdersProps) => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.INCOMING_SHIPMENTS, initialParams],
      queryFn: () => incomingOrderService.getIncomingOrders(initialParams),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return { prefetchGetIncomingOrders };
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

export const useUpdateIncomingOrderNotes = () => {
  const updateIncomingOrderNotes = useCreateMutation<UpdateOrderNotesProps>({
    mutationFn: (props: UpdateOrderNotesProps) =>
      incomingOrderService.updateIncomingOrderNotes(props),
    successMessage: SUCCESS_MESSAGES.UPDATE_ORDER_NOTES,
    errorMessage: ERROR_MESSAGES.UPDATE_ORDER_NOTES,
    invalidateKeys: [
      [QUERY_KEYS.INCOMING_SHIPMENTS],
      [QUERY_KEYS.ORDER_SUMMARY],
    ],
  });

  return {
    updateIncomingOrderNotesAsync: updateIncomingOrderNotes.mutateAsync,
    isUpdatingIncomingOrderNotesError: updateIncomingOrderNotes.isError,
    isUpdatingIncomingOrderNotesSuccess: updateIncomingOrderNotes.isSuccess,
    isUpdatingIncomingOrderNotes: updateIncomingOrderNotes.isPending,
  };
};

export const useUpdateProductDGType = () => {
  const updateProductDGType = useCreateMutation<UpdateProductDGType>({
    mutationFn: (props: UpdateProductDGType) =>
      InventoryService.updateProductDGType(props),
    successMessage: SUCCESS_MESSAGES.UPDATE_DG_PRODUCT,
    errorMessage: ERROR_MESSAGES.UPDATE_DG_PRODUCT,
    invalidateKeys: [
      [QUERY_KEYS.INCOMING_SHIPMENTS],
      [QUERY_KEYS.ORDER_SUMMARY],
      [QUERY_KEYS.PRODUCTS],
    ],
  });

  return {
    updateProductDGTypeAsync: updateProductDGType.mutateAsync,
    isUpdatingProductDGTypeError: updateProductDGType.isError,
    isUpdatingProductDGTypeSuccess: updateProductDGType.isSuccess,
    isUpdatingProductDGType: updateProductDGType.isPending,
  };
};
