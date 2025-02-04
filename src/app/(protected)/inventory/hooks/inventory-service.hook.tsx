import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/constants";
import { useCreateMutation } from "@/hooks/mutation-factory";
import { inventoryService } from "@/services";
import {
  CreateProductRequest,
  EditProductProps,
  GetInventoryProps,
  GetProductsResponse,
} from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useGetAllProducts = (params: GetInventoryProps) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<GetInventoryProps>(params);

  const fetchProducts = useQuery<GetProductsResponse, Error>({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: () => inventoryService.getInventory(filters),
    gcTime: 1000 * 60 * 10, // 5 minutes
    staleTime: 1000 * 60 * 10, // 5 minutes
  });

  const filterBySupplier = (supplier_id: number | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      supplier: supplier_id ? supplier_id.toString() : "",
      page: 1,
      limit: 50,
    }));

    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };

  const filterByKeyword = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
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

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    products: fetchProducts.data?.data || [],
    isLoading: fetchProducts.isLoading,
    isError: fetchProducts.isError,
    errorMessage: fetchProducts.error?.message,
    isFetching: fetchProducts.isFetching,
    refetch: fetchProducts.refetch,
    filterBySupplier,
    filterByKeyword,
    orderBy,
    changePage,
    changeLimit,
    currentPage: filters.page,
    itemsPerPage: filters.limit,
  };
};

// Hook for creating a new product
export const useCreateProduct = () => {
  return useCreateMutation<CreateProductRequest>({
    mutationFn: (data: CreateProductRequest) =>
      inventoryService.createProduct(data),
    successMessage: SUCCESS_MESSAGES.CREATE_PRODUCT,
    errorMessage: ERROR_MESSAGES.CREATE_PRODUCT,
    invalidateKeys: [[QUERY_KEYS.PRODUCTS]], // Invalidate user list after registration
  });
};

// Hook for updating a product
export const useUpdateProduct = () => {
  return useCreateMutation<EditProductProps>({
    mutationFn: (data: EditProductProps) => inventoryService.editProduct(data),
    successMessage: SUCCESS_MESSAGES.UPDATE_PRODUCTS,
    errorMessage: ERROR_MESSAGES.UPDATE_PRODUCTS,
    invalidateKeys: [[QUERY_KEYS.PRODUCTS]], // Invalidate user list after registration
  });
};

// Hook for deleting a product
export const useDeleteProduct = () => {
  return useCreateMutation<string>({
    mutationFn: (id: string) => inventoryService.deleteProduct(parseInt(id)),
    successMessage: SUCCESS_MESSAGES.DELETE_PRODUCT,
    errorMessage: ERROR_MESSAGES.DELETE_PRODUCT,
    invalidateKeys: [[QUERY_KEYS.PRODUCTS]], // Invalidate user list after registration
  });
};
