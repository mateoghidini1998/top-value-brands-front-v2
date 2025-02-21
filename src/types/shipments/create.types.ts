export interface CreateShipmentProps {
  palletproducts: { pallet_product_id: number; quantity: number }[];
  shipment_number: string;
}
