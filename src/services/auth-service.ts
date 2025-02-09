import { BaseService, type IApiRequest } from "./base-service";
import {
  EditUserRole,
  GetUsersResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateUserRoleResponse,
} from "@/types/auth.type";

export class AuthService extends BaseService {
  constructor(apiRequest: IApiRequest) {
    super(apiRequest);
  }

  protected getEndpoint(): string {
    return "/auth";
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
