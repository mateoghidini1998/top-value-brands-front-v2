import { apiRequest } from "@/helpers/http.adapter";

interface DeleteSupplierResponse {
  success: boolean;
  data: DeleteSupplierData;
}

interface DeleteSupplierData {
  id: number;
  order_number: string;
  supplier_id: number;
  purchase_order_status_id: number;
  total_price: string;
  notes: string;
  is_active: boolean;
  updatedStatusAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteSupplierProps {
  supplierId: number;
}

export const deleteSupplier = async ({
  supplierId,
}: DeleteSupplierProps): Promise<DeleteSupplierResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/suppliers/${supplierId}`;
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return apiRequest<DeleteSupplierResponse>(url, options);
};
