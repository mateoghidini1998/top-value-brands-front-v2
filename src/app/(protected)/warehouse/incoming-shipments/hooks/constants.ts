export const QUERY_KEYS = {
  ORDER_SUMMARY: "order-summary",
  ORDERS: "orders",
  PRODUCTS: "products",
  INCOMING_SHIPMENTS: "incoming-shipments",
  PALLETS: "pallets",
} as const;

export const CACHE_TIMES = {
  ONE_HOUR: 1000 * 60 * 60, // 1 hour
} as const;

export const ERROR_MESSAGES = {
  UPDATE_PRODUCTS: "Error updating products",
  CREATE_PALLET: "Error creating pallet",
} as const;

export const SUCCESS_MESSAGES = {
  UPDATE_PRODUCTS: "Products updated successfully",
  CREATE_PALLET: "Pallet created successfully",
} as const;
