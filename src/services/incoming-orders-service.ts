import {
  GetOrdersProps,
  GetPurchaseOrdersResponse,
  UpdateOrderNotesProps,
} from "@/types/purchase-orders";
import { BaseService, IApiRequest } from "./base-service";
import { UpdateIncomingOrderProductsProps } from "@/types/incoming-orders/update.types";

export class IncomingOrdersService extends BaseService {
  constructor(apiRequest: IApiRequest) {
    super(apiRequest);
  }
  protected getEndpoint(): string {
    return "/purchaseorders";
  }

  public async getIncomingOrders({
    page = 1,
    limit = 50,
    keyword = "",
    supplier = "",
    status = "",
    orderBy = "",
    orderWay = "",
    excludeStatus = "",
  }: GetOrdersProps = {}): Promise<GetPurchaseOrdersResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      keyword,
      supplier,
      status,
      orderBy,
      orderWay,
      excludeStatus,
    }).toString();

    const url = this.constructUrl(`/incoming-shipments?${queryParams}`);
    return this.apiRequest<GetPurchaseOrdersResponse>(url);
  }

  public async updateIncomingOrderProducts({
    orderId,
    incomingOrderProductUpdates,
  }: UpdateIncomingOrderProductsProps) {
    const url = this.constructUrl(`/update-incoming-order/${orderId}`);
    const options = this.constructOptions("PATCH", {
      incomingOrderProductUpdates,
    });
    return this.apiRequest<string>(url, options);
  }

  public async updateIncomingOrderNotes({
    orderId,
    notes,
  }: UpdateOrderNotesProps) {
    const url = this.constructUrl(`/incoming-order-notes/${orderId}`);
    const options = this.constructOptions("PATCH", {
      incoming_order_notes: notes,
    });
    return this.apiRequest<string>(url, options);
  }
}
