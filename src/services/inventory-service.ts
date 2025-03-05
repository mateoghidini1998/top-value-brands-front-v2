import { BaseService, type IApiRequest } from "./base-service";
import type {
  CreateProductRequest,
  CreateProductResponse,
  EditProductProps,
  GetInventoryProps,
  GetProductsResponse,
  PalletProductResponse,
} from "@/types";

export class InventoryService extends BaseService {
  constructor(apiRequest: IApiRequest) {
    super(apiRequest);
  }

  protected getEndpoint(): string {
    return "/products";
  }

  public async createProduct(
    data: CreateProductRequest
  ): Promise<CreateProductResponse> {
    const url = this.constructUrl("/");
    const options = this.constructOptions("POST", data);
    return this.apiRequest<CreateProductResponse>(url, options);
  }

  public async editProduct(
    data: EditProductProps
  ): Promise<PalletProductResponse> {
    const url = this.constructUrl("/addExtraInfoToProduct");
    const options = this.constructOptions("PATCH", data);
    return this.apiRequest<PalletProductResponse>(url, options);
  }

  public async deleteProduct(id: number): Promise<PalletProductResponse> {
    const url = this.constructUrl("/disable");
    const options = this.constructOptions("PATCH", { id });
    return this.apiRequest(url, options);
  }

  public async deleteProductFromSellerAccount(
    id: number
  ): Promise<PalletProductResponse> {
    const url = this.constructUrl(`/${id}`);
    const options = this.constructOptions("DELETE");
    return this.apiRequest(url, options);
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
    return this.apiRequest<GetProductsResponse>(url);
  }
}
