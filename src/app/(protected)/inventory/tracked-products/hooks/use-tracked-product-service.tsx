"use client";

import { QUERY_KEYS } from "@/constants";
import { serviceFactory } from "@/services";
import { GetTrackedProductsResponse } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { GetTrackedProductsProps } from "../actions";

const trackedProductService = serviceFactory.getTrackedProductService();

export const useGetTrackedProducts = (
  initialParams: GetTrackedProductsProps
) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] =
    useState<GetTrackedProductsProps>(initialParams);

  const { data, isLoading, isError, error, refetch } = useQuery<
    GetTrackedProductsResponse,
    Error
  >({
    queryKey: [QUERY_KEYS.TRACKED_PRODUCTS, filters],
    queryFn: () => trackedProductService.getTrackedProducts(filters),
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
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRACKED_PRODUCTS] });
  };

  const filterByKeyword = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRACKED_PRODUCTS] });
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
    trackedProductsResponse: data,
    trackedProductsIsLoading: isLoading,
    trackedProductsIsError: isError,
    trackedProductsErrorMessage: error?.message,
    trackedProductsRefetch: refetch,
    filterBySupplier,
    filterByKeyword,
    orderBy,
    changePage,
    changeLimit,
    currentPage: filters.page || 1,
    itemsPerPage: filters.limit || 50,
  };
};

export const usePrefetchGetTrackedProducts = () => {
  const queryClient = useQueryClient();

  const prefetchGetTrackedProducts = () => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.TRACKED_PRODUCTS],
      queryFn: () =>
        trackedProductService.getTrackedProducts({
          page: 1,
          limit: 50,
        }),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return { prefetchGetTrackedProducts };
};
