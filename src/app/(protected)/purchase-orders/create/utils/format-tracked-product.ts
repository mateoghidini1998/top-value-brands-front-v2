// import { TrackedProduct } from "../../../inventory/tracked-products/interfaces/tracked-product.interface";
import { TrackedProduct } from "@/types";
import { ProductInOrder } from "../interface/product-added.interface";

export const formatTrackedProduct = (
  product: TrackedProduct
): ProductInOrder => {
  return {
    id: product.id,
    product_id: product.product_id,
    supplier_id: product.supplier_id ? product.supplier_id : "N/A",
    product_name: product.product_name,
    product_image: product.product_image,
    ASIN: product.ASIN,
    supplier_name: product.supplier_name ?? "Unknown",
    quantity:
      product.FBA_available_inventory +
      product.reserved_quantity +
      product.Inbound_to_FBA,
    product_cost: parseFloat(product.product_cost),
    total_amount:
      parseFloat(product.product_cost) *
      (product.FBA_available_inventory +
        product.reserved_quantity +
        product.Inbound_to_FBA),
    units_sold: product.units_sold,
    fees: product.fees ?? 0,
    lowest_fba_price: product.lowest_fba_price,
    in_seller_account: product.in_seller_account || false,
    pack_type: product.pack_type || 1,
  };
};
