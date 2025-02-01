export const ERROR_MESSAGES = {
  UPDATE_PRODUCTS: "Error updating products",
  UPDATE_NOTES: "Error updating notes",
  UPDATE_NUMBER: "Error updating order number",
  UPDATE_STATUS: "Error updating order status",
  UPDATE_SHIPMENT: "Error updating shipment",
  CREATE_SHIPMENT: "Error creating shipment",
  UPDATE_ORDER: "Error updating order",

  DELETE_ORDER_PRODUCT: "Error deleting order product",
  ADD_PRODUCT_TO_ORDER: "Error adding product to order",

  DELETE_SHIPMENT: "Error deleting shipment",

  CREATE_SUPPLIER: "Error creating supplier",
  DELETE_SUPPLIER: "Error deleting supplier",
  UPDATE_SUPPLIER: "Error updating supplier",

  CHECK_SHIPMENT_PRODUCT: "Error checking shipment product",
} as const;

export const SUCCESS_MESSAGES = {
  UPDATE_PRODUCTS: "Products updated successfully",
  UPDATE_NOTES: "Notes updated successfully",
  UPDATE_NUMBER: "Order number updated successfully",
  UPDATE_STATUS: "Order status updated successfully",
  UPDATE_SHIPMENT: "Shipment updated successfully",
  CREATE_SHIPMENT: "Shipment created successfully",
  UPDATE_ORDER: "Order updated successfully",

  DELETE_ORDER_PRODUCT: "Order product deleted successfully",
  ADD_PRODUCT_TO_ORDER: "Product added to order successfully",

  DELETE_SHIPMENT: "Shipment deleted successfully",

  CREATE_SUPPLIER: "Supplier created successfully",
  DELETE_SUPPLIER: "Supplier deleted successfully",
  UPDATE_SUPPLIER: "Supplier updated successfully",

  CHECK_SHIPMENT_PRODUCT: "Shipment product checked successfully",
} as const;
