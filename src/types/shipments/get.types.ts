export interface GetShipmentsProps {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  orderBy?: string;
  orderWay?: string;
}
export interface GetShipmentsResponse {
  shipments: Shipment[];
  total: number;
}

export interface Shipment {
  id: number;
  shipment_number: string;
  status: string;
  fba_shipment_id: null;
  createdAt: Date;
  updatedAt: Date;
  reference_id: string;
  PalletProducts: ShipmentPalletProduct[];
}

export interface ShipmentPalletProduct {
  id: number;
  purchaseorderproduct_id: number;
  pallet_id: number;
  quantity: number;
  available_quantity: number;
  createdAt: Date;
  updatedAt: Date;
  OutgoingShipmentProduct: OutgoingShipmentProduct;
  warehouse_location: string;
  upc: string;
  is_checked: boolean;
  dg_item: string | null;
}

export interface OutgoingShipmentProduct {
  id: number;
  quantity: number;
  is_checked: boolean;
}

export interface GetShipemntByIDResponse {
  id: number;
  shipment_number: string;
  status: string;
  fba_shipment_id: null;
  createdAt: Date;
  updatedAt: Date;
  PalletProducts: ShipmentPalletProduct[];
  pallets: ShipmentPallet[];
}

export interface ShipmentPalletProduct {
  id: number;
  purchaseorderproduct_id: number;
  pallet_id: number;
  quantity: number;
  available_quantity: number;
  createdAt: Date;
  updatedAt: Date;
  Pallet: ShipmentPallet;
  OutgoingShipmentProduct: OutgoingShipmentProduct;
  pallet_number: string;
  product_name: string;
  product_image: string;
  seller_sku: string;
  upc: string;
  in_seller_account: boolean | null;
  ASIN: string;
  pack_type: number;
}

export interface OutgoingShipmentProduct {
  quantity: number;
}

export interface ShipmentPallet {
  id: number;
  pallet_number: string;
  pallet_id: number;
  warehouse_location: string;
  allProductsInShipment: boolean;
  allProductsChecked: boolean;
}
