export const QUERY_KEYS = {
  ORDER_SUMMARY: "order-summary",
  ORDERS: "orders",
  PRODUCTS: "products",
  INCOMING_SHIPMENTS: "incoming-shipments",
  PALLETS: "pallets",
  PALLET_PRODUCTS: "pallet-products",
  WAREHOUSE_LOCATIONS: "warehouse-locations",
} as const;

export const CACHE_TIMES = {
  ONE_HOUR: 1000 * 60 * 60, // 1 hour
} as const;

export const ERROR_MESSAGES = {
  UPDATE_PRODUCTS: "Error updating products",
  CREATE_PALLET: "Error creating pallet",
  WAREHOUSE_LOCATIONS: "Error getting warehouse locations",
} as const;

export const SUCCESS_MESSAGES = {
  UPDATE_PRODUCTS: "Products updated successfully",
  CREATE_PALLET: "Pallet created successfully",
  WAREHOUSE_LOCATIONS: "Warehouse locations fetched successfully",
} as const;
