import { apiRequest } from "@/helpers/http.adapter";
import { GetSuppliersResponse } from "../interfaces/supplier.interface";

export const getSuppliers = async (): Promise<GetSuppliersResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/suppliers`;
  return apiRequest<GetSuppliersResponse>(url);
};
