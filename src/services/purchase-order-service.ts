import { GetPurchaseOrderSummaryResponse } from "@/types";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  DeleteOrderProps,
  DeleteOrderResponse,
} from "@/types/purchase-orders";
import { AddProductsToOrderProps } from "@/types/purchase-orders/add-products-to-order.types";
import { DeleteOrderProductProps } from "@/types/purchase-orders/delete-products-form-order.types";
import { DownloadPDFProps } from "@/types/purchase-orders/download.types";
import {
  GetOrdersProps,
  GetPurchaseOrdersResponse,
} from "@/types/purchase-orders/get.types";
import {
  UpdateOrderNotesProps,
  UpdateOrderNumberProps,
  UpdateOrderProductsProps,
  UpdateOrderStatusProps,
  UpdatePurchaseOrderProps,
} from "@/types/purchase-orders/update.types";
import { BaseService, type IApiRequest } from "./base-service";

export class PurchaseOrderService extends BaseService {
  constructor(apiRequest: IApiRequest) {
    super(apiRequest);
  }

  protected getEndpoint(): string {
    return "/purchaseorders";
  }

  public async createOrder(
    order: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    const url = this.constructUrl("/");
    const options = this.constructOptions("POST", order);
    return this.apiRequest<CreateOrderResponse>(url, options);
  }

  public async deleteOrder({
    orderId,
  }: DeleteOrderProps): Promise<DeleteOrderResponse> {
    const url = this.constructUrl(`/delete/${orderId}`);
    const options = this.constructOptions("DELETE");
    return this.apiRequest<DeleteOrderResponse>(url, options);
  }

  public async downloadPDF({ orderId }: DownloadPDFProps): Promise<void> {
    const url = this.constructUrl(`/download/${orderId}`);
    const options = this.constructOptions("GET");

    try {
      const blob = await this.apiRequest<Blob>(url, options);
      const pdfUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `purchase-order-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  }

  public async getOrders({
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

  public async updateOrderStatus({
    orderId,
    status,
  }: UpdateOrderStatusProps): Promise<string> {
    const url = this.constructUrl(`/${orderId}/status`);
    const options = this.constructOptions("PATCH", { status });
    return this.apiRequest<string>(url, options);
  }

  public async addProductsToOrder({
    orderId,
    products,
  }: AddProductsToOrderProps) {
    const url = this.constructUrl(`/add-products/${orderId}`);
    const options = this.constructOptions("POST", { products });
    return this.apiRequest<string>(url, options);
  }

  public async deleteOrderProduct({ orderProductId }: DeleteOrderProductProps) {
    const url = this.constructUrl(`/purchaseorderproduct/${orderProductId}`);
    const options = this.constructOptions("DELETE");
    return this.apiRequest<string>(url, options);
  }

  public async getPurchaseOrderSummary({ orderId }: { orderId: string }) {
    const url = this.constructUrl(`/summary/${orderId}`);
    return await this.apiRequest<GetPurchaseOrderSummaryResponse>(url);
  }

  public async updateOrderNotes({ orderId, notes }: UpdateOrderNotesProps) {
    const url = this.constructUrl(`/${orderId}`);
    const options = this.constructOptions("PUT", { notes });
    return this.apiRequest<string>(url, options);
  }

  public async updateOrderNumber({
    orderId,
    order_number,
  }: UpdateOrderNumberProps) {
    const url = this.constructUrl(`/orderNumber/${orderId}`);
    const options = this.constructOptions("PATCH", { order_number });
    return this.apiRequest<string>(url, options);
  }

  public async updateOrderProducts({
    orderId,
    purchaseOrderProductsUpdates,
  }: UpdateOrderProductsProps) {
    const url = this.constructUrl(`/${orderId}/products`);
    const options = this.constructOptions("PATCH", {
      purchaseOrderProductsUpdates,
    });
    return this.apiRequest<string>(url, options);
  }

  public updatePurchaseOrder({
    orderId,
    notes,
    purchase_order_status_id,
    products,
  }: UpdatePurchaseOrderProps) {
    const url = this.constructUrl(`/${orderId}`);
    const options = this.constructOptions("PUT", {
      ...(notes && { notes }),
      ...(purchase_order_status_id && { purchase_order_status_id }),
      ...(products && { products }),
    });
    return this.apiRequest<string>(url, options);
  }
}
