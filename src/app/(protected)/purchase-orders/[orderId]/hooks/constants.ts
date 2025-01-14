export const QUERY_KEYS = {
  PURCHASE_ORDER: "purchase-order",
  ORDERS: "orders",
} as const;

export const CACHE_TIMES = {
  ONE_HOUR: 1000 * 60 * 60,
} as const;

export const ERROR_MESSAGES = {
  UPDATE_PRODUCTS: "Error updating products",
  UPDATE_NOTES: "Error updating notes",
  UPDATE_NUMBER: "Error updating order number",
} as const;

export const SUCCESS_MESSAGES = {
  UPDATE_PRODUCTS: "Products updated successfully",
  UPDATE_NOTES: "Notes updated successfully",
  UPDATE_NUMBER: "Order number updated successfully",
} as const;
