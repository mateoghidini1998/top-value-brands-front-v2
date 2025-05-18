import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateProductRequest,
  EditProductProps,
  GetInventoryProps,
  GetProductsResponse,
  SupressedListingsResponse,
  UpdateProductDGType,
} from "@/types";
import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/constants";
import { useCreateMutation } from "@/hooks/mutation-factory";
import { serviceFactory } from "@/services";

const inventoryService = serviceFactory.getInventoryService();

export const useGetAllProducts = (initialParams: GetInventoryProps) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<GetInventoryProps>(initialParams);

  const { data, isLoading, isError, error, refetch } = useQuery<
    GetProductsResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.PRODUCTS, filters],
    queryFn: () => inventoryService.getInventory(filters),
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
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
  };

  const filterByKeyword = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
  };

  // const orderBy = (orderBy: string) => {
  //   setFilters((prev) => {
  //     // Determine the new orderWay
  //     const newOrderWay =
  //       orderBy === prev.orderBy
  //         ? prev.orderWay === "ASC"
  //           ? "DESC"
  //           : "ASC"
  //         : "DESC";

  //     return { ...prev, orderBy, orderWay: newOrderWay };
  //   });
  // };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    productResponse: data,
    productIsLoading: isLoading,
    productIsError: isError,
    productErrorMessage: error?.message,
    productRefetch: refetch,
    filterBySupplier,
    filterByKeyword,
    // orderBy,
    changePage,
    changeLimit,
    currentPage: filters.page || 1,
    itemsPerPage: filters.limit || 50,
  };
};

// Hook for creating a new product
export const useCreateProduct = () => {
  const createProduct = useCreateMutation<CreateProductRequest>({
    mutationFn: (data: CreateProductRequest) =>
      inventoryService.createProduct(data),
    successMessage: SUCCESS_MESSAGES.CREATE_PRODUCT,
    errorMessage: ERROR_MESSAGES.CREATE_PRODUCT,
    invalidateKeys: [[QUERY_KEYS.PRODUCTS]], // Invalidate user list after registration
  });

  return {
    createAsync: createProduct.mutateAsync,
    isCreatingError: createProduct.isError,
    isCreatingSuccess: createProduct.isSuccess,
    isCreating: createProduct.isPending,
  };
};

// Hook for updating a product
export const useUpdateProduct = () => {
  const updateProduct = useCreateMutation<EditProductProps>({
    mutationFn: (data: EditProductProps) => inventoryService.editProduct(data),
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    invalidateKeys: [[QUERY_KEYS.PRODUCTS]], 
  });

  return {
    updateAsync: updateProduct.mutateAsync,
    isUpdatingError: updateProduct.isError,
    isUpdatingSuccess: updateProduct.isSuccess,
    isUpdating: updateProduct.isPending,
  };
};

// Hook for deleting a product
export const useDeleteProduct = () => {
  const deleteProduct = useCreateMutation<string>({
    mutationFn: (id: string) => inventoryService.deleteProduct(parseInt(id)),
    successMessage: SUCCESS_MESSAGES.DELETE_PRODUCT,
    errorMessage: ERROR_MESSAGES.DELETE_PRODUCT,
    invalidateKeys: [[QUERY_KEYS.PRODUCTS]],
  });

  return {
    deleteAsync: deleteProduct.mutateAsync,
    isDeletingError: deleteProduct.isError,
    isDeletingSuccess: deleteProduct.isSuccess,
    isDeleting: deleteProduct.isPending,
  };
};

export const useDeleteProductFromSellerAccount = () => {
  const deleteProduct = useCreateMutation<string>({
    mutationFn: (id: string) =>
      inventoryService.deleteProductFromSellerAccount(parseInt(id)),
    successMessage: SUCCESS_MESSAGES.DELETE_PRODUCT,
    errorMessage: ERROR_MESSAGES.DELETE_PRODUCT,
    invalidateKeys: [[QUERY_KEYS.PRODUCTS]],
  });

  return {
    deleteFromSellerAccountAsync: deleteProduct.mutateAsync,
    isDeletingFromSellerAccountError: deleteProduct.isError,
    isDeletingFromSellerAccountSuccess: deleteProduct.isSuccess,
    isDeletingFromSellerAccount: deleteProduct.isPending,
  };
};

export const useUpdateProductDGType = () => {
  const updateProductDGType = useCreateMutation<UpdateProductDGType>({
    mutationFn: (data: UpdateProductDGType) =>
      inventoryService.updateProductDGType(data),
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    invalidateKeys: [[QUERY_KEYS.PRODUCTS]], 
  });
  return {
    updateDGTypeAsync: updateProductDGType.mutateAsync,
    isUpdatingDGTypeError: updateProductDGType.isError,
    isUpdatingDGTypeSuccess: updateProductDGType.isSuccess,
    isUpdatingDGType: updateProductDGType.isPending,
  };
};

export const useGetSupressedListings = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    SupressedListingsResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.SUPRESSED_LISTINGS],
    queryFn: () => inventoryService.getSupressedListings(),
    gcTime: 1000 * 60 * 10, // 10 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    supressedListings: data,
    supressedListingsIsLoading: isLoading,
    supressedListingsIsError: isError,
    supressedListingsErrorMessage: error?.message,
    supressedListingsRefetch: refetch,
  };
};
