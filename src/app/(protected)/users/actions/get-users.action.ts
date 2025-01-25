import { apiRequest } from "@/helpers/http.adapter";
import { GetUsersResponse } from "@/types/auth.type";

export const getAllClerkUsers = async (): Promise<GetUsersResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/users`;
  return apiRequest<GetUsersResponse>(url);
};
