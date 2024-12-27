import { apiRequest } from "@/helpers/http.adapter";
import { GetTrackedProductsResponse } from "../interfaces/tracked-product.interface";

export interface GetTrackedProductsProps {
  page?: number;
  limit?: number;
  keyword?: string;
  orderBy?: string;
  orderWay?: string;
  supplier?: string;
}

export const getTrackedProducts = async (props: GetTrackedProductsProps) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/trackedproducts?orderBy=${props.orderBy}&orderWay=${props.orderWay}&page=${props.page}&limit=${props.limit}&keyword=${props.keyword}&supplier=${props.supplier}`;
  return await apiRequest<GetTrackedProductsResponse>(url);
};
