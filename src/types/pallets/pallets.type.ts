//! GetPalletsResponse -> Generated by https://quicktype.io

export interface GetPalletsResponse {
  success: boolean;
  total: number;
  pages: number;
  currentPage: number;
  data: Pallet[];
}

export interface Pallet {
  id: number;
  pallet_number: string;
  warehouse_location_id: number;
  warehouse_location: string;
  purchase_order_number: string;
  purchase_order_id: number;
  createdAt: Date;
  updatedAt: Date;
  products: PalletProductResponse[];
  storage_type: string;
}

export interface PalletProductResponse {
  id: number;
  PalletProduct: PalletProductByID;
}

export interface PalletProductByID {
  quantity: number;
  available_quantity: number | null;
}

//! GetPalletByIDResponse -> Generated by https://quicktype.io

export interface GetPalletByIDResponse {
  id: number;
  pallet_number: string;
  warehouse_location_id: number;
  purchase_order_id: number;
  createdAt: Date;
  updatedAt: Date;
  PalletProducts: PalletProductByID[];
  warehouseLocation: WarehouseLocation;
  purchaseOrder: PurchaseOrder;
}

export interface PalletProductByID {
  purchaseorderproduct_id: number;
  pallet_id: number;
  quantity: number;
  available_quantity: number | null;
  createdAt: Date;
  updatedAt: Date;
  purchaseOrderProduct: PurchaseOrderProduct;
}

export interface PurchaseOrderProduct {
  id: number;
  expire_date: string;
  Product: GetPalletProduct;
}

export interface GetPalletProduct {
  product_name: string;
  product_image: string;
  seller_sku: string;
  in_seller_account: boolean;
  upc: string;
  pack_type: string;
}

export interface PurchaseOrder {
  id: number;
  order_number: string;
}

export interface WarehouseLocation {
  id: number;
  location: string;
}

export interface GetAllPalletProductsResponse {
  id: number;
  order_number: string;
  pallets: GetAllPalletProductsResponsePallet[];
}

export interface GetAllPalletProductsResponsePallet {
  id: number;
  pallet_number: string;
  warehouse_location: string;
  is_hazmat: string;
  palletProducts: GetAllPalletProductsResponsePalletProduct[];
}

export interface GetAllPalletProductsResponsePalletProduct {
  id: number;
  purchaseorderproduct_id: number;
  outgoingshipmentproduct_is_checked?: boolean;
  quantity: number;
  available_quantity: number | null;
  createdAt: Date;
  updatedAt: Date;
  product: GetAllPalletProductsResponseProduct;
  pallet_id: number;
}

export interface GetAllPalletProductsResponseProduct {
  product_name: string;
  product_image: null | string;
  seller_sku: string;
  ASIN: string;
  in_seller_account: boolean;
  upc: null | string;
}
