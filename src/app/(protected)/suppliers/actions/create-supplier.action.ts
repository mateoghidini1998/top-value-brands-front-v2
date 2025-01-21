import { apiRequest } from "@/helpers/http.adapter";

interface CreateSupplierRequest {
  supplier_name: string;
}

interface CreateSupplierResponse {
  success: boolean;
  data: Data;
}

interface Data {
  id: number;
  supplier_name: string;
  createdAt: string;
  updatedAt: string;
}

export const createSupplier = (
  supplier: CreateSupplierRequest
): Promise<CreateSupplierResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/suppliers`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(supplier),
  };

  return apiRequest<CreateSupplierResponse>(url, options);
};
