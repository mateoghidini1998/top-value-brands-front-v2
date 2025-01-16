export const QUERY_KEYS = {
  ORDER_SUMMARY: "order-summary",
  ORDERS: "orders",
  PRODUCTS: "products",
  INCOMING_SHIPMENTS: "incoming-shipments",
} as const;

export const CACHE_TIMES = {
  ONE_HOUR: 1000 * 60 * 60, // 1 hour
} as const;

export const ERROR_MESSAGES = {
  UPDATE_PRODUCTS: "Error updating products",
} as const;

export const SUCCESS_MESSAGES = {
  UPDATE_PRODUCTS: "Products updated successfully",
} as const;
