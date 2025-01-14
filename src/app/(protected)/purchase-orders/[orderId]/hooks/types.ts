import { GetPurchaseOrderSummaryResponse } from "../../interfaces/orders.interface";
import { UpdateOrderProductsProps } from "../actions/update-order-products.action";
import { UpdateOrderNotesProps } from "../actions/update-purchase-order-notes.action";
import { UpdateOrderNumberProps } from "../actions/update-order-number.action";

// Make MutationConfig more flexible by not constraining the generic type
export interface MutationConfig<T> {
  mutationFn: (data: T) => Promise<unknown>;
  orderId: string | number; // Support both string and number
  errorMessage: string;
  successMessage: string;
}

export interface PurchaseOrderHookResult {
  data: GetPurchaseOrderSummaryResponse | undefined;
  isLoading: boolean;
  error: Error | null;

  // Products
  updateOrderProducts: (data: UpdateOrderProductsProps) => void;
  updateOrderProductsAsync: (
    data: UpdateOrderProductsProps
  ) => Promise<unknown>;
  isError: boolean;
  isSuccess: boolean;

  // Notes
  updateOrderNotes: (data: UpdateOrderNotesProps) => void;
  updateOrderNotesAsync: (data: UpdateOrderNotesProps) => Promise<unknown>;
  isErrorNotes: boolean;
  isSuccessNotes: boolean;

  // Order Number
  updateOrderNumber: (data: UpdateOrderNumberProps) => void;
  updateOrderNumberAsync: (data: UpdateOrderNumberProps) => Promise<unknown>;
  isErrorNumber: boolean;
  isSuccessNumber: boolean;
}
