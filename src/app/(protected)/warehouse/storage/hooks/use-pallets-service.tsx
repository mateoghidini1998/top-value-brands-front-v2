import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/constants";
import { useCreateMutation } from "@/hooks/mutation-factory";
import { serviceFactory } from "@/services";
import { GetPalletByIDResponse, GetPalletsResponse } from "@/types";
import { CreatePalletProps } from "@/types/pallets/create.types";
import { GetPalletsProps } from "@/types/pallets/get.types";
import { UpdatePalletLocationProps } from "@/types/pallets/update.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const palletsService = serviceFactory.getPalletsService();

export const useGetAllPallets = (initialParams: GetPalletsProps) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<GetPalletsProps>(initialParams);

  const { data, isLoading, isError, error, refetch } = useQuery<
    GetPalletsResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.PALLETS, filters],
    queryFn: () => palletsService.getAllPallets(filters),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filterByLocation = (location_id: number | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      location: location_id ? location_id.toString() : "",
      page: 1,
      limit: 50,
    }));
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PALLETS] });
  };

  const filterByPalletNumber = (pallet_number: string) => {
    setFilters((prev) => ({ ...prev, pallet_number, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PALLETS] });
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
    palletsResponse: data,
    palletsIsLoading: isLoading,
    palletsIsError: isError,
    palletsError: error,
    palletsRefetch: refetch,
    orderBy,
    changePage,
    changeLimit,
    currentPage: filters.page || 1,
    itemsPerPage: filters.limit || 50,
    filterByPalletNumber,
    filterByLocation,
  };
};

export const useGetPalletById = (palletId: string) => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    GetPalletByIDResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.PALLET, palletId],
    queryFn: () => palletsService.getPalletById(palletId),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    pallet: data,
    palletIsLoading: isLoading,
    palletIsError: isError,
    palletError: error,
    palletRefetch: refetch,
  };
};

export const usePrefetchPalletByID = (palletId: string) => {
  const queryClient = useQueryClient();

  const prefetchPalletByID = () => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.PALLET, palletId],
      queryFn: () => palletsService.getPalletById(palletId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return {
    prefetchPalletByID,
  };
};
export const useCreatePallet = () => {
  const createPallet = useCreateMutation<CreatePalletProps>({
    mutationFn: (data: CreatePalletProps) => palletsService.createPallet(data),
    successMessage: SUCCESS_MESSAGES.CREATE_PALLET,
    errorMessage: ERROR_MESSAGES.CREATE_PALLET,
    invalidateKeys: [
      [QUERY_KEYS.PALLETS],
      [QUERY_KEYS.ORDER_SUMMARY],
      ["pallet-products"],
    ],
  });

  return {
    createPalletAsync: createPallet.mutateAsync,
    isCreatingPalletError: createPallet.isError,
    isCreatingPalletSuccess: createPallet.isSuccess,
    isCreatingPallet: createPallet.isPending,
  };
};

export const useUpdatePalletLocation = (palletId: string) => {
  const updatePalletLocation = useCreateMutation<UpdatePalletLocationProps>({
    mutationFn: (data: UpdatePalletLocationProps) =>
      palletsService.updatePalletLocation(data),
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    invalidateKeys: [[QUERY_KEYS.PALLET, palletId], [QUERY_KEYS.PALLETS]],
  });

  return {
    updatePalletLocationAsync: updatePalletLocation.mutateAsync,
    isUpdatingPalletLocationError: updatePalletLocation.isError,
    isUpdatingPalletLocationSuccess: updatePalletLocation.isSuccess,
    isUpdatingPalletLocation: updatePalletLocation.isPending,
  };
};

export const useDeletePallet = (palletId: number) => {
  const deletePallet = useCreateMutation<string>({
    mutationFn: () => palletsService.deletePallet(palletId),
    successMessage: SUCCESS_MESSAGES.DELETE_PALLET,
    errorMessage: ERROR_MESSAGES.DELETE_PALLET,
    invalidateKeys: [[QUERY_KEYS.PALLETS], [QUERY_KEYS.ORDER_SUMMARY]],
  });

  return {
    deletePalletAsync: deletePallet.mutateAsync,
    isDeletingPalletError: deletePallet.isError,
    isDeletingPalletSuccess: deletePallet.isSuccess,
    isDeletingPallet: deletePallet.isPending,
  };
};
