import { apiRequest } from "@/helpers/http.adapter";
import { UpdateUserRoleResponse } from "@/types/auth.type";

export interface EditUserRole {
  role: string;
  userId: string;
}

export const updateUserRole = async (
  data: EditUserRole
): Promise<UpdateUserRoleResponse> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${data.userId}`;
  const options: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      role: data.role,
    }),
  };
  return apiRequest<UpdateUserRoleResponse>(url, options);
};
