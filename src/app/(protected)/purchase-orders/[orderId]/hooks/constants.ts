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
  UPDATE_NOTES: "Error updating notes",
  UPDATE_NUMBER: "Error updating order number",
  UPDATE_STATUS: "Error updating order status",
  UPDATE_SHIPMENT: "Error updating shipment",

  DELETE_ORDER_PRODUCT: "Error deleting order product",
} as const;

export const SUCCESS_MESSAGES = {
  UPDATE_PRODUCTS: "Products updated successfully",
  UPDATE_NOTES: "Notes updated successfully",
  UPDATE_NUMBER: "Order number updated successfully",
  UPDATE_STATUS: "Order status updated successfully",
  UPDATE_SHIPMENT: "Shipment updated successfully",

  DELETE_ORDER_PRODUCT: "Order product deleted successfully",
} as const;
