export const ERROR_MESSAGES = {
  UPDATE_PRODUCTS: "Error updating products",
  UPDATE_NOTES: "Error updating notes",
  UPDATE_NUMBER: "Error updating order number",
  UPDATE_STATUS: "Error updating order status",
  UPDATE_SHIPMENT: "Error updating shipment",
  CREATE_SHIPMENT: "Error creating shipment",

  DELETE_ORDER_PRODUCT: "Error deleting order product",
  ADD_PRODUCT_TO_ORDER: "Error adding product to order",
} as const;

export const SUCCESS_MESSAGES = {
  UPDATE_PRODUCTS: "Products updated successfully",
  UPDATE_NOTES: "Notes updated successfully",
  UPDATE_NUMBER: "Order number updated successfully",
  UPDATE_STATUS: "Order status updated successfully",
  UPDATE_SHIPMENT: "Shipment updated successfully",
  CREATE_SHIPMENT: "Shipment created successfully",

  DELETE_ORDER_PRODUCT: "Order product deleted successfully",
  ADD_PRODUCT_TO_ORDER: "Product added to order successfully",
} as const;
