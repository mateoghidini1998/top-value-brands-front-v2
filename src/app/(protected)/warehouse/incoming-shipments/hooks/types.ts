import { GetPurchaseOrderSummaryResponse } from "@/types";
import { UpdateIncomingOrderProductsProps } from "../actions";

// Make MutationConfig more flexible by not constraining the generic type
export interface MutationConfig<T> {
  mutationFn: (variables: T) => Promise<unknown>;
  orderId: number | string;
  successMessage: string;
  errorMessage: string;
  invalidateKeys?: (string | number)[][]; // Keys a invalidar
}

export interface PurchaseOrderHookResult {
  data: GetPurchaseOrderSummaryResponse | undefined;
  isLoading: boolean;
  error: Error | null;

  // Products
  updateIncomingOrderProducts: (data: UpdateIncomingOrderProductsProps) => void;
  updateOrderProductsAsync: (
    data: UpdateIncomingOrderProductsProps
  ) => Promise<unknown>;
  isError: boolean;
  isSuccess: boolean;
}
