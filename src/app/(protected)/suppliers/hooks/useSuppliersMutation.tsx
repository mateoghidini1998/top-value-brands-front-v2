"use client";

import { ERROR_MESSAGES, QUERY_KEYS, SUCCESS_MESSAGES } from "@/app/constants";
import { useCreateMutation } from "@/hooks/mutation-factory";
import { deleteSupplier } from "../actions/delete-supplier.action";
import { createSupplier } from "../actions/create-supplier.action";

export const useSupplierMutations = () => {
  const createSupplierMutation = useCreateMutation({
    mutationFn: createSupplier,
    errorMessage: ERROR_MESSAGES.CREATE_SUPPLIER,
    successMessage: SUCCESS_MESSAGES.CREATE_SUPPLIER,
    invalidateKeys: [[QUERY_KEYS.SUPPLIERS]],
  });

  const deleteSupplierMutation = useCreateMutation({
    mutationFn: deleteSupplier,
    errorMessage: ERROR_MESSAGES.DELETE_SUPPLIER,
    successMessage: SUCCESS_MESSAGES.DELETE_SUPPLIER,
    invalidateKeys: [[QUERY_KEYS.SUPPLIERS]],
  });

  return {
    createSupplier: createSupplierMutation.mutate,
    createSupplierAsync: createSupplierMutation.mutateAsync,
    isErrorSupplier: createSupplierMutation.isError,
    isSuccessSupplier: createSupplierMutation.isSuccess,

    deleteSupplier: deleteSupplierMutation.mutate,
    deleteSupplierAsync: deleteSupplierMutation.mutateAsync,
    isErrorDeleteSupplier: deleteSupplierMutation.isError,
    isSuccessDeleteSupplier: deleteSupplierMutation.isSuccess,
  };
};
