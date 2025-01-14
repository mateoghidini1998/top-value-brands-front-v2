"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getInventory,
} from "../actions";

export const useInventory = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    keyword: "",
    supplier: "",
    orderBy: "",
    orderWay: "",
  });

  const fetchInventory = ({
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
  }) => getInventory({ page, limit, keyword, supplier, orderBy, orderWay });

  const inventoryQuery = useQuery({
    queryKey: ["inventory", filters],
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
      return fetchInventory(params);
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

    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };

  const filterByKeyword = (keyword: string) => {
    setFilters((prev) => ({ ...prev, keyword, page: 1, limit: 50 }));
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };

  const changePage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      console.log("Product created successfully");
      // Invalidate the inventory query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  const editProductMutation = useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      console.log("Product edited successfully");
      // Invalidate the inventory query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError(error: Error) {
      console.error(error);
      toast.error(error.message);
    },
  });

  return {
    inventoryQuery,
    filterBySupplier,
    filterByKeyword,
    changePage,
    changeLimit,
    currentPage: filters.page,
    itemsPerPage: filters.limit,
    createProductMutation,
    editProductMutation,
    deleteProductMutation,
  };
};
