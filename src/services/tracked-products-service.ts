import { GetTrackedProductsResponse } from "@/types";
import { BaseService, IApiRequest } from "./base-service";
import { GetTrackedProductsProps } from "@/app/(protected)/inventory/tracked-products/actions";

export class TrackedProductService extends BaseService {
  constructor(apiRequest: IApiRequest) {
    super(apiRequest);
  }
  protected getEndpoint(): string {
    return "/trackedproducts";
  }

  public async getTrackedProducts({
    page = 1,
    limit = 50,
    keyword = "",
    supplier = "",
    orderBy = "",
    orderWay = "",
  }: GetTrackedProductsProps): Promise<GetTrackedProductsResponse> {
    const url = this.constructUrl(
      `?page=${page}&limit=${limit}&keyword=${keyword}&supplier=${supplier}&orderBy=${orderBy}&orderWay=${orderWay}`
    );
    return this.apiRequest<GetTrackedProductsResponse>(url);
  }
}
