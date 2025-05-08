import { supabase } from "@/lib/supabase-client";
import type { UpdateIncomingOrderProductsProps } from "@/types/incoming-orders/update.types";
import type {
  GetOrdersProps,
  GetPurchaseOrdersResponse,
  UpdateOrderNotesProps,
} from "@/types/purchase-orders";
import { BaseService, type IApiRequest } from "./base-service";

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

  public async uploadInvoiceFile(
    file: File,
    orderId: string
  ): Promise<{ path: string }> {
    const filePath = `${orderId}/${file.name}`;

    const { data, error } = await supabase.storage
      .from("purchaseorders-invoice")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error details:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    if (!data) {
      throw new Error("Upload failed: No data returned");
    }

    return data;
  }

  public async listInvoiceFiles(orderId: string): Promise<string[]> {
    const { data, error } = await supabase.storage
      .from("purchaseorders-invoice")
      .list(`${orderId}/`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }

    return data?.map((file) => file.name) || [];
  }

  public async getInvoiceFileUrl(
    orderId: string,
    fileName: string
  ): Promise<string> {
    const filePath = `${orderId}/${fileName}`;

    const { data } = supabase.storage
      .from("purchaseorders-invoice")
      .getPublicUrl(filePath);

    if (!data.publicUrl) {
      throw new Error("Failed to generate public URL");
    }

    return data.publicUrl;
  }

  public async downloadInvoiceFile(
    orderId: string,
    fileName: string
  ): Promise<Blob> {
    const filePath = `${orderId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("purchaseorders-invoice")
      .download(filePath);

    if (error) {
      console.error("Download error details:", error);
      throw new Error(`Download failed: ${error.message}`);
    }

    if (!data) {
      throw new Error("Download failed: No data returned");
    }

    return data;
  }

  public async debugStorageAccess(orderId: string) {
    console.log("Debugging storage access...");

    try {
      const { data: rootData, error: rootError } = await supabase.storage
        .from("purchaseorders-invoice")
        .list("");

      console.log("Root directory contents:", rootData, rootError);

      const { data: orderData, error: orderError } = await supabase.storage
        .from("purchaseorders-invoice")
        .list(`${orderId}/`);

      console.log(
        `Order ${orderId} directory contents:`,
        orderData,
        orderError
      );
    } catch (error) {
      console.error("Debug error:", error);
    }
  }

  async deleteInvoiceFile(orderId: string, fileName: string): Promise<void> {
    const filePath = `${orderId}/${fileName}`;
    console.log("Deleting file at path:", filePath); // 👈 esto ayuda a confirmar

    const { data, error } = await supabase.storage
      .from("purchaseorders-invoice")
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.warn("No files deleted. File may not exist.");
      throw new Error("File not found or already deleted.");
    }

    console.log("File deleted successfully:", data);
  }
}
