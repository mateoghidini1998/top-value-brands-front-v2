export interface DeletePalletResponse {
  success: boolean;
  data: DeletePalletData;
}

interface DeletePalletData {
  id: number;
  pallet_number: string;
  warehouse_location_id: number;
  purchase_order_id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeletePalletProps {
  palletId: number;
}
