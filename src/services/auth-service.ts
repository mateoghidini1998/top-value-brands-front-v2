import { apiRequest } from "@/helpers/http.adapter";
import {
  EditUserRole,
  GetUsersResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateUserRoleResponse,
} from "@/types/auth.type";

interface IApiRequest {
  <T>(url: string, options?: RequestInit): Promise<T>;
}

export class AuthService {
  private static API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  constructor(private apiRequest: IApiRequest) {
    if (!AuthService.API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }
  }

  private constructUrl(endpoint: string): string {
    return `${AuthService.API_BASE_URL}/api/v1/auth${endpoint}`;
  }

  private constructOptions(method: string, data?: unknown): RequestInit {
    return {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    };
  }

  public async getAllClerkUsers(): Promise<GetUsersResponse> {
    const url = this.constructUrl("");
    return this.apiRequest<GetUsersResponse>(url);
  }

  public async registerUser(data: RegisterRequest): Promise<RegisterResponse> {
    const url = this.constructUrl("/register");
    const options = this.constructOptions("POST", data);
    return this.apiRequest<RegisterResponse>(url, options);
  }

  public async updateUserRole(
    data: EditUserRole
  ): Promise<UpdateUserRoleResponse> {
    const url = this.constructUrl(`/${data.userId}`);
    const options = this.constructOptions("PATCH", { role: data.role });
    return this.apiRequest<UpdateUserRoleResponse>(url, options);
  }
}

// Export an instance of the service for use across the application
export const authService = new AuthService(apiRequest);
