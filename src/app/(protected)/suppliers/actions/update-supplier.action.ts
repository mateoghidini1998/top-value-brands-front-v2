import { apiRequest } from "@/helpers/http.adapter";

interface UpdateSupplierRequest {
  id: number;
  supplier_name: string;
}

interface UpdateSupplierResponse {
  success: boolean;
  data: Data;
}

interface Data {
  id: number;
  supplier_name: string;
  createdAt: string;
  updatedAt: string;
}

export const updateSupplier = (
  supplier: UpdateSupplierRequest
): Promise<UpdateSupplierResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/suppliers/${supplier.id}`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supplier),
  };

  return apiRequest<UpdateSupplierResponse>(url, options);
};
