import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/constants";
import { useCreateMutation } from "@/hooks/mutation-factory";
import { serviceFactory } from "@/services";
import {
  CreateShipmentProps,
  UpdateShipmentProps,
} from "@/types/shipments/create.types";
import {
  GetShipemntByIDResponse,
  GetShipmentsProps,
  GetShipmentsResponse,
} from "@/types/shipments/get.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const shipmentsService = serviceFactory.getShipmentsService();

export const useGetAllShipments = (initialParams: GetShipmentsProps) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<GetShipmentsProps>(initialParams);

  const { data, isLoading, isError, error, refetch } = useQuery<
    GetShipmentsResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.SHIPMENTS, filters],
    queryFn: () => shipmentsService.getAllShipments(filters),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filterByShipmentNumber = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHIPMENTS] });
  };

  const filterByStatus = (status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHIPMENTS] });
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
    shipmentsResponse: data,
    shipmentsIsLoading: isLoading,
    shipmentsIsError: isError,
    shipmentsError: error,
    shipmentsRefetch: refetch,
    orderBy,
    changePage,
    changeLimit,
    currentPage: filters.page || 1,
    itemsPerPage: filters.limit || 50,
    filterByShipmentNumber,
    filterByStatus,
  };
};

export const usePrefetchShipmentByID = (shipmentId: string) => {
  const queryClient = useQueryClient();

  const prefetchShipmentByID = () => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.SHIPMENT, shipmentId],
      queryFn: () => shipmentsService.getShipmentById(shipmentId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return {
    prefetchShipmentByID,
  };
};

export const useGetShipmentById = (shipmentId: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    GetShipemntByIDResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.SHIPMENT, shipmentId],
    queryFn: () => shipmentsService.getShipmentById(shipmentId),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    shipment: data,
    shipmentIsLoading: isLoading,
    shipmentIsError: isError,
    shipmentError: error,
    shipmentRefetch: refetch,
  };
};

export const useCreateShipment = () => {
  const createShipment = useCreateMutation<CreateShipmentProps>({
    mutationFn: (data: CreateShipmentProps) =>
      shipmentsService.createShipment(data),
    successMessage: SUCCESS_MESSAGES.CREATE_SHIPMENT,
    errorMessage: ERROR_MESSAGES.CREATE_SHIPMENT,
    invalidateKeys: [[QUERY_KEYS.SHIPMENTS], [QUERY_KEYS.PALLET_PRODUCTS]],
  });

  return {
    createShipmentAsync: createShipment.mutateAsync,
    isCreatingShipmentError: createShipment.isError,
    isCreatingShipmentSuccess: createShipment.isSuccess,
    isCreatingShipment: createShipment.isPending,
  };
};

export const useUpdateShipment = (shipmentId: number) => {
  const updateShipment = useCreateMutation<UpdateShipmentProps>({
    mutationFn: (shipmentUpdates: UpdateShipmentProps) =>
      shipmentsService.updateShipment(shipmentUpdates),
    successMessage: SUCCESS_MESSAGES.UPDATE_SHIPMENT,
    errorMessage: ERROR_MESSAGES.UPDATE_SHIPMENT,
    invalidateKeys: [[QUERY_KEYS.SHIPMENT, shipmentId]],
  });

  return {
    updateShipmentAsync: updateShipment.mutateAsync,
    isUpdatingShipmentError: updateShipment.isError,
    isUpdatingShipmentSuccess: updateShipment.isSuccess,
    isUpdatingShipment: updateShipment.isPending,
  };
};

export const useDeleteShipment = (shipmentId: string) => {
  const deleteShipment = useCreateMutation<string>({
    mutationFn: () => shipmentsService.deleteShipment(shipmentId),
    successMessage: SUCCESS_MESSAGES.DELETE_SHIPMENT,
    errorMessage: ERROR_MESSAGES.DELETE_SHIPMENT,
    invalidateKeys: [
      [QUERY_KEYS.SHIPMENTS],
      [QUERY_KEYS.PALLET_PRODUCTS],
      [QUERY_KEYS.WAREHOUSE_AVAILABLE_LOCATIONS],
    ],
  });

  return {
    deleteShipmentAsync: deleteShipment.mutateAsync,
    isDeletingShipmentError: deleteShipment.isError,
    isDeletingShipmentSuccess: deleteShipment.isSuccess,
    isDeletingShipment: deleteShipment.isPending,
  };
};

export const useCheckShipmentProducts = (outgoingShipmentProductId: number) => {
  const checkShipmentProduct = useCreateMutation<number>({
    mutationFn: () =>
      shipmentsService.checkProductShipment(outgoingShipmentProductId),
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    invalidateKeys: [
      [QUERY_KEYS.SHIPMENT],
      [QUERY_KEYS.SHIPMENTS],
      [QUERY_KEYS.WAREHOUSE_AVAILABLE_LOCATIONS],
    ],
  });

  return {
    checkShipmentProductAsync: checkShipmentProduct.mutateAsync,
    isCheckingShipmentProductError: checkShipmentProduct.isError,
    isCheckingShipmentProductSuccess: checkShipmentProduct.isSuccess,
    isCheckingShipmentProduct: checkShipmentProduct.isPending,
  };
};

export const useToggleCheckAllShipmentProducts = (
  shipmentId: number,
  palletId: number
) => {
  const toggleCheckAllShipmentProducts = useCreateMutation<number>({
    mutationFn: () =>
      shipmentsService.toggleCheckAllPalletProducts(shipmentId, palletId),
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    invalidateKeys: [
      [QUERY_KEYS.SHIPMENT],
      [QUERY_KEYS.SHIPMENTS],
      [QUERY_KEYS.WAREHOUSE_AVAILABLE_LOCATIONS],
    ],
  });

  return {
    toggleCheckAllShipmentProductsAsync:
      toggleCheckAllShipmentProducts.mutateAsync,
    isTogglingCheckAllShipmentProductsError:
      toggleCheckAllShipmentProducts.isError,
    isTogglingCheckAllShipmentProductsSuccess:
      toggleCheckAllShipmentProducts.isSuccess,
    isTogglingCheckAllShipmentProducts:
      toggleCheckAllShipmentProducts.isPending,
  };
};

export const useAddReferenceId = (shipmentId: string) => {
  const addReferenceId = useCreateMutation<string>({
    mutationFn: (referenceId: string) =>
      shipmentsService.addReferenceId(shipmentId, referenceId),
    successMessage: SUCCESS_MESSAGES.UPDATE_REFERENCE_ID,
    errorMessage: ERROR_MESSAGES.UPDATE_REFERENCE_ID,
    invalidateKeys: [[QUERY_KEYS.SHIPMENT, shipmentId], [QUERY_KEYS.SHIPMENTS]],
  });

  return {
    addReferenceIdAsync: addReferenceId.mutateAsync,
    isAddingReferenceIdError: addReferenceId.isError,
    isAddingReferenceIdSuccess: addReferenceId.isSuccess,
    isAddingReferenceId: addReferenceId.isPending,
  };
};

export const useAddFbaShipmentId = (shipmentId: string) => {
  const addFbaShipmentId = useCreateMutation<string>({
    mutationFn: (fbaShipmentId: string) =>
      shipmentsService.addFbaShipmentId(shipmentId, fbaShipmentId),
    successMessage: SUCCESS_MESSAGES.UPDATE_FBA_SHIPMENT_ID,
    errorMessage: ERROR_MESSAGES.UPDATE_FBA_SHIPMENT_ID,
    invalidateKeys: [[QUERY_KEYS.SHIPMENT, shipmentId], [QUERY_KEYS.SHIPMENTS]],
  });

  return {
    addFbaShipmentIdAsync: addFbaShipmentId.mutateAsync,
    isAddingReferenceIdError: addFbaShipmentId.isError,
    isAddingReferenceIdSuccess: addFbaShipmentId.isSuccess,
    isAddingReferenceId: addFbaShipmentId.isPending,
  };
};

export const useUpdateFbaShipmentStatusToShipped = (shipmentId: string) => {
  const updateFbaShipmentStatusToShipped = useCreateMutation<string>({
    mutationFn: () =>
      shipmentsService.updateFbaShipmentStatusToShipped(shipmentId),
    successMessage: SUCCESS_MESSAGES.UPDATE_FBA_SHIPMENT_STATUS,
    errorMessage: ERROR_MESSAGES.UPDATE_FBA_SHIPMENT_STATUS,
    invalidateKeys: [
      [QUERY_KEYS.SHIPMENT, shipmentId],
      [QUERY_KEYS.SHIPMENTS],
      [QUERY_KEYS.PRODUCTS],
    ],
  });

  return {
    updateFbaShipmentStatusToShippedAsync:
      updateFbaShipmentStatusToShipped.mutateAsync,
    updateFbaShipmentStatusToShippedError:
      updateFbaShipmentStatusToShipped.isError,
    updateFbaShipmentStatusToShippedSuccess:
      updateFbaShipmentStatusToShipped.isSuccess,
    isUpdatingFbaShipmentStatusToShipped:
      updateFbaShipmentStatusToShipped.isPending,
  };
};

export const updateShipmentStatusToReadyToBeShipped = (shipmentId: string) => {
  const updateShipmentStatusToReadyToBeShipped = useCreateMutation<string>({
    mutationFn: () =>
      shipmentsService.updateShipmentStatusToReadyToBeShipped(shipmentId),
    successMessage: SUCCESS_MESSAGES.UPDATE_FBA_SHIPMENT_STATUS,
    errorMessage: ERROR_MESSAGES.UPDATE_FBA_SHIPMENT_STATUS,
    invalidateKeys: [
      [QUERY_KEYS.SHIPMENT, shipmentId],
      [QUERY_KEYS.SHIPMENTS],
      [QUERY_KEYS.PRODUCTS],
    ],
  });

  return {
    updateShipmentStatusToReadyToBeShippedAsync:
    updateShipmentStatusToReadyToBeShipped.mutateAsync,
    updateFbaShipmentStatusToShippedError:
    updateShipmentStatusToReadyToBeShipped.isError,
    updateFbaShipmentStatusToShippedSuccess:
    updateShipmentStatusToReadyToBeShipped.isSuccess,
    isUpdatingFbaShipmentStatusToShipped:
    updateShipmentStatusToReadyToBeShipped.isPending,
  };
};
