import { apiRequest } from "@/helpers/http.adapter";
import {
  CreateProductRequest,
  CreateProductResponse,
  EditProductProps,
  GetInventoryProps,
  GetProductsResponse,
  PalletProductResponse,
} from "@/types";

interface IApiRequest {
  <T>(url: string, options?: RequestInit): Promise<T>;
}

export class InventoryService {
  private static API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  constructor(private apiRequest: IApiRequest) {
    if (!InventoryService.API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }
  }

  private constructUrl(endpoint: string): string {
    return `${InventoryService.API_BASE_URL}/api/v1/products${endpoint}`;
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

  public async createProduct(
    data: CreateProductRequest
  ): Promise<CreateProductResponse> {
    const url = this.constructUrl("/");
    const options = this.constructOptions("POST", data);
    return apiRequest<CreateProductResponse>(url, options);
  }

  public async editProduct(
    data: EditProductProps
  ): Promise<PalletProductResponse> {
    const url = this.constructUrl("/addExtraInfoToProduct");
    const options = this.constructOptions("PATCH", data);
    return apiRequest<PalletProductResponse>(url, options);
  }

  public async deleteProduct(id: number): Promise<PalletProductResponse> {
    const url = this.constructUrl("/disable");
    const options = this.constructOptions("PATCH", { id });
    return apiRequest<PalletProductResponse>(url, options);
  }

  public async getInventory({
    page = 1,
    limit = 50,
    keyword = "",
    supplier = "",
    orderBy = "",
    orderWay = "",
  }: GetInventoryProps): Promise<GetProductsResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      keyword,
      supplier,
      orderBy,
      orderWay,
    }).toString();

    const url = this.constructUrl(`?${queryParams}`);
    return apiRequest<GetProductsResponse>(url);
  }
}

// Export an instance of the service for use across the application
export const inventoryService = new InventoryService(apiRequest);
