import { apiRequest } from "@/helpers/http.adapter";
import { RegisterRequest, RegisterResponse } from "@/types/auth.type";

export const registerUser = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return apiRequest<RegisterResponse>(url, options);
};
