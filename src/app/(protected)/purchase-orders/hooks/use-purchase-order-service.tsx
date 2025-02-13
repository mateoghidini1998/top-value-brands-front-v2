"use client";

import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/constants";
import { useCreateMutation } from "@/hooks/mutation-factory";
import { serviceFactory } from "@/services";
import { GetPurchaseOrderSummaryResponse } from "@/types";
import {
  CreateOrderRequest,
  DeleteOrderProps,
  DownloadPDFProps,
  GetOrdersProps,
  GetPurchaseOrdersResponse,
  UpdateOrderNotesProps,
  UpdateOrderNumberProps,
  UpdateOrderProductsProps,
  UpdateOrderStatusProps,
  UpdatePurchaseOrderProps,
} from "@/types/purchase-orders";
import { AddProductsToOrderProps } from "@/types/purchase-orders/add-products-to-order.types";
import { DeleteOrderProductProps } from "@/types/purchase-orders/delete-products-form-order.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const purchaseOrderService = serviceFactory.getPurchaseOrderService();

export const useGetAllOrders = (initialParams: GetOrdersProps) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<GetOrdersProps>(initialParams);

  const { data, isLoading, isError, error, refetch } = useQuery<
    GetPurchaseOrdersResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.ORDERS, filters],
    queryFn: () => purchaseOrderService.getOrders(filters),
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
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
  };

  const filterByStatus = (status_id: number | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: status_id ? status_id.toString() : "",
      page: 1,
      limit: 50,
    }));
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
  };

  const filterByKeyword = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
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
    ordersResponse: data,
    ordersIsLoading: isLoading,
    ordersIsError: isError,
    ordersErrorMessage: error?.message,
    ordersRefetch: refetch,
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

export const usePrefetchGetAllOrders = () => {
  const queryClient = useQueryClient();

  const prefetchGetAllOrders = (filters: GetOrdersProps) => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.ORDERS, filters],
      queryFn: () => purchaseOrderService.getOrders(filters),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return { prefetchGetAllOrders };
};

// Hook for creating a new order
export const useCreateOrder = () => {
  const createOrder = useCreateMutation<CreateOrderRequest>({
    mutationFn: (data: CreateOrderRequest) =>
      purchaseOrderService.createOrder(data),
    successMessage: SUCCESS_MESSAGES.CREATE_ORDER,
    errorMessage: ERROR_MESSAGES.CREATE_ORDER,
    invalidateKeys: [[QUERY_KEYS.ORDERS]],
  });

  return {
    createOrderAsync: createOrder.mutateAsync,
    isCreatingOrderError: createOrder.isError,
    isCreatingOrderSuccess: createOrder.isSuccess,
    isCreatingOrder: createOrder.isPending,
  };
};

// Hook for deleting an order
export const useDeleteOrder = () => {
  const deleteOrder = useCreateMutation<DeleteOrderProps>({
    mutationFn: (props: DeleteOrderProps) =>
      purchaseOrderService.deleteOrder(props),
    successMessage: SUCCESS_MESSAGES.DELETE_ORDER,
    errorMessage: ERROR_MESSAGES.DELETE_ORDER,
    invalidateKeys: [[QUERY_KEYS.ORDERS]],
  });

  return {
    deleteOrderAsync: deleteOrder.mutateAsync,
    isDeletingOrderError: deleteOrder.isError,
    isDeletingOrderSuccess: deleteOrder.isSuccess,
    isDeletingOrder: deleteOrder.isPending,
  };
};

// Hook for downloading PDF
export const useDownloadPDF = () => {
  const downloadPDF = useCreateMutation<DownloadPDFProps>({
    mutationFn: (props: DownloadPDFProps) =>
      purchaseOrderService.downloadPDF(props),
    successMessage: SUCCESS_MESSAGES.DOWNLOAD_PDF,
    errorMessage: ERROR_MESSAGES.DOWNLOAD_PDF,
  });

  return {
    downloadPDFAsync: downloadPDF.mutateAsync,
    isDownloadingPDFError: downloadPDF.isError,
    isDownloadingPDFSuccess: downloadPDF.isSuccess,
    isDownloadingPDF: downloadPDF.isPending,
  };
};

// Hook for updating order status
export const useUpdateOrderStatus = () => {
  const updateOrderStatus = useCreateMutation<UpdateOrderStatusProps>({
    mutationFn: (props: UpdateOrderStatusProps) =>
      purchaseOrderService.updateOrderStatus(props),
    successMessage: SUCCESS_MESSAGES.UPDATE_ORDER_STATUS,
    errorMessage: ERROR_MESSAGES.UPDATE_ORDER_STATUS,
    invalidateKeys: [[QUERY_KEYS.ORDERS], [QUERY_KEYS.INCOMING_SHIPMENTS]],
  });

  return {
    updateOrderStatusAsync: updateOrderStatus.mutateAsync,
    isUpdatingOrderStatusError: updateOrderStatus.isError,
    isUpdatingOrderStatusSuccess: updateOrderStatus.isSuccess,
    isUpdatingOrderStatus: updateOrderStatus.isPending,
  };
};

export const useAddProductsToOrder = () => {
  const addProductsToOrder = useCreateMutation<AddProductsToOrderProps>({
    mutationFn: (props: AddProductsToOrderProps) =>
      purchaseOrderService.addProductsToOrder(props),
    successMessage: SUCCESS_MESSAGES.ADD_PRODUCTS_TO_ORDER,
    errorMessage: ERROR_MESSAGES.ADD_PRODUCTS_TO_ORDER,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY], [QUERY_KEYS.ORDERS]],
  });

  return {
    addProductsToOrderAsync: addProductsToOrder.mutateAsync,
    isAddingProductsToOrderError: addProductsToOrder.isError,
    isAddingProductsToOrderSuccess: addProductsToOrder.isSuccess,
    isAddingProductsToOrder: addProductsToOrder.isPending,
  };
};
export const useDeleteOrderProduct = () => {
  const deleteOrderProduct = useCreateMutation<DeleteOrderProductProps>({
    mutationFn: (props: DeleteOrderProductProps) =>
      purchaseOrderService.deleteOrderProduct(props),
    successMessage: SUCCESS_MESSAGES.DELETE_ORDER_PRODUCT,
    errorMessage: ERROR_MESSAGES.DELETE_ORDER_PRODUCT,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY], [QUERY_KEYS.ORDERS]],
  });

  return {
    deleteOrderProductAsync: deleteOrderProduct.mutateAsync,
    isDeletingOrderProductError: deleteOrderProduct.isError,
    isDeletingOrderProductSuccess: deleteOrderProduct.isSuccess,
    isDeletingOrderProduct: deleteOrderProduct.isPending,
  };
};

export const useGetPurchaseOrderSummary = (orderId: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    GetPurchaseOrderSummaryResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.ORDER_SUMMARY, orderId],
    queryFn: () => purchaseOrderService.getPurchaseOrderSummary({ orderId }),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!orderId,
  });

  return {
    ordersSummaryResponse: data,
    ordersSummaryIsLoading: isLoading,
    ordersSummaryIsError: isError,
    ordersSummaryError: error,
    ordersSummaryRefetch: refetch,
  };
};

export const usePrefetchOrderSummary = () => {
  const queryClient = useQueryClient();

  const prefetchOrderSummary = (orderId: string) => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.ORDER_SUMMARY, orderId],
      queryFn: () => purchaseOrderService.getPurchaseOrderSummary({ orderId }),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return { prefetchOrderSummary };
};

export const useUpdateOrderNotes = () => {
  const updateOrderNotes = useCreateMutation<UpdateOrderNotesProps>({
    mutationFn: (props: UpdateOrderNotesProps) =>
      purchaseOrderService.updateOrderNotes(props),
    successMessage: SUCCESS_MESSAGES.UPDATE_ORDER_NOTES,
    errorMessage: ERROR_MESSAGES.UPDATE_ORDER_NOTES,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY], [QUERY_KEYS.ORDERS]],
  });

  return {
    updateOrderNotesAsync: updateOrderNotes.mutateAsync,
    isUpdatingOrderNotesError: updateOrderNotes.isError,
    isUpdatingOrderNotesSuccess: updateOrderNotes.isSuccess,
    isUpdatingOrderNotes: updateOrderNotes.isPending,
  };
};

export const useUpdateOrderNumber = () => {
  const updateOrderNumber = useCreateMutation<UpdateOrderNumberProps>({
    mutationFn: (props: UpdateOrderNumberProps) =>
      purchaseOrderService.updateOrderNumber(props),
    successMessage: SUCCESS_MESSAGES.UPDATE_ORDER_NUMBER,
    errorMessage: ERROR_MESSAGES.UPDATE_ORDER_NUMBER,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY], [QUERY_KEYS.ORDERS]],
  });

  return {
    updateOrderNumberAsync: updateOrderNumber.mutateAsync,
    isUpdatingOrderNumberError: updateOrderNumber.isError,
    isUpdatingOrderNumberSuccess: updateOrderNumber.isSuccess,
    isUpdatingOrderNumber: updateOrderNumber.isPending,
  };
};

export const useUpdateOrderProducts = () => {
  const updateOrderProducts = useCreateMutation<UpdateOrderProductsProps>({
    mutationFn: (props: UpdateOrderProductsProps) =>
      purchaseOrderService.updateOrderProducts(props),
    successMessage: SUCCESS_MESSAGES.UPDATE_ORDER_PRODUCTS,
    errorMessage: ERROR_MESSAGES.UPDATE_ORDER_PRODUCTS,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY], [QUERY_KEYS.ORDERS]],
  });

  return {
    updateOrderProductsAsync: updateOrderProducts.mutateAsync,
    isUpdatingOrderProductsError: updateOrderProducts.isError,
    isUpdatingOrderProductsSuccess: updateOrderProducts.isSuccess,
    isUpdatingOrderProducts: updateOrderProducts.isPending,
  };
};

export const useUpdatePurchaseOrder = () => {
  const updatePurchaseOrder = useCreateMutation<UpdatePurchaseOrderProps>({
    mutationFn: (props: UpdatePurchaseOrderProps) =>
      purchaseOrderService.updatePurchaseOrder(props),
    successMessage: SUCCESS_MESSAGES.UPDATE_PURCHASE_ORDER,
    errorMessage: ERROR_MESSAGES.UPDATE_PURCHASE_ORDER,
    invalidateKeys: [[QUERY_KEYS.ORDER_SUMMARY], [QUERY_KEYS.ORDERS]],
  });

  return {
    updatePurchaseOrderAsync: updatePurchaseOrder.mutateAsync,
    isUpdatingPurchaseOrderError: updatePurchaseOrder.isError,
    isUpdatingPurchaseOrderSuccess: updatePurchaseOrder.isSuccess,
    isUpdatingPurchaseOrder: updatePurchaseOrder.isPending,
  };
};
