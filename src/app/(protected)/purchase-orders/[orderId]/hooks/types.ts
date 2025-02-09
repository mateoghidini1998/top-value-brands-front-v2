import { GetPurchaseOrderSummaryResponse } from "@/types";
import { UpdateOrderProductsProps } from "../actions/update-order-products.action";
import { UpdateOrderNotesProps } from "../actions/update-order-notes.action";
import { UpdateOrderNumberProps } from "../actions/update-order-number.action";
import { UpdateOrderStatusProps } from "../../actions";

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

  // Status
  updateOrderStatus: (data: UpdateOrderStatusProps) => void;
  updateOrderStatusAsync: (data: UpdateOrderStatusProps) => Promise<unknown>;
  isErrorStatus: boolean;
  isSuccessStatus: boolean;
}
