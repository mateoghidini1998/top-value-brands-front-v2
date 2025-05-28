export interface CreateShipmentProps {
  palletproducts: { pallet_product_id: number; quantity: number }[];
  shipment_number: string;
}
export interface UpdateShipmentProps {
  shipment_id: number;
  palletproducts: { pallet_product_id: number; quantity: number }[];
}
