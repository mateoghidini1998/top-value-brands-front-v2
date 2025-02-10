import {
  GetOrdersProps,
  GetPurchaseOrdersResponse,
} from "@/types/purchase-orders";
import { BaseService, IApiRequest } from "./base-service";
import { UpdateIncomingOrderProductsProps } from "@/types/incoming-orders/update.types";

export class IncomingOrdersService extends BaseService {
  constructor(apiRequest: IApiRequest) {
    super(apiRequest);
  }
  protected getEndpoint(): string {
    return "/purchaseorders/incoming-shipments";
  }

  public async getIncomingOrders({
    page = 1,
    limit = 50,
    keyword = "",
    supplier = "",
    status = "",
    orderBy = "",
    orderWay = "",
  }: GetOrdersProps = {}): Promise<GetPurchaseOrdersResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      keyword,
      supplier,
      status,
      orderBy,
      orderWay,
    }).toString();

    const url = this.constructUrl(`?${queryParams}`);
    return this.apiRequest<GetPurchaseOrdersResponse>(url);
  }

  public async updateIncomingOrderProducts({
    orderId,
    incomingOrderProductUpdates,
  }: UpdateIncomingOrderProductsProps) {
    const url = this.constructUrl(`/${orderId}`);
    const options = this.constructOptions("PATCH", {
      incomingOrderProductUpdates,
    });
    return this.apiRequest<string>(url, options);
  }
}
