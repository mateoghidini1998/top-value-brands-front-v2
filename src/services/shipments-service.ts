import {
  GetShipemntByIDResponse,
  GetShipmentsProps,
  GetShipmentsResponse,
} from "@/types/shipments/get.types";
import { BaseService, type IApiRequest } from "./base-service";
import { CreateShipmentProps, UpdateShipmentProps } from "@/types/shipments/create.types";

export class ShipmentsService extends BaseService {
  constructor(apiRequest: IApiRequest) {
    super(apiRequest);
  }

  protected getEndpoint(): string {
    return "/shipments";
  }

  public async getAllShipments({
    page = 1,
    limit = 50,
    keyword = "",
    status = "",
    orderBy = "",
    orderWay = "",
  }: GetShipmentsProps = {}): Promise<GetShipmentsResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      keyword,
      status,
      orderBy,
      orderWay,
    }).toString();

    const url = this.constructUrl(`?${queryParams}`);
    return this.apiRequest<GetShipmentsResponse>(url);
  }

  public async getShipmentById(
    shipmentId: string
  ): Promise<GetShipemntByIDResponse> {
    const url = this.constructUrl(`/${shipmentId}`);
    return this.apiRequest<GetShipemntByIDResponse>(url);
  }

  public async createShipment(shipment: CreateShipmentProps) {
    const url = this.constructUrl("/");
    const options = this.constructOptions("POST", shipment);
    return this.apiRequest<string>(url, options);
  }
  public async updateShipment(shipmentUpdates: UpdateShipmentProps) {
    const url = this.constructUrl(`/${shipmentUpdates.shipment_id}/v2`);
    const options = this.constructOptions("PUT", shipmentUpdates);
    return this.apiRequest<string>(url, options);
  }

  public async deleteShipment(shipmentId: string): Promise<string> {
    const url = this.constructUrl(`/${shipmentId}`);
    const options = this.constructOptions("DELETE");
    return this.apiRequest<string>(url, options);
  }

  public async checkProductShipment(outgoingShipmentProductId: number) {
    const url = this.constructUrl(`/checked/${outgoingShipmentProductId}`);
    const options = this.constructOptions("PUT");
    return this.apiRequest<string>(url, options);
  }

  public async addReferenceId(shipmentId: string, referenceId: string) {
    const url = this.constructUrl(`/reference/${shipmentId}`);
    const options = this.constructOptions("PATCH", { referenceId });
    return this.apiRequest<string>(url, options);
  }

  public async addFbaShipmentId(shipmentId: string, fbaShipmentId: string) {
    const url = this.constructUrl(`/reference/fba/${shipmentId}`);
    const options = this.constructOptions("PATCH", { fbaShipmentId });
    return this.apiRequest<string>(url, options);
  }

  public async updateFbaShipmentStatusToShipped(shipmentId: string) {
    const url = this.constructUrl(`/status-shipped/${shipmentId}`);
    const options = this.constructOptions("PATCH", { shipmentId });
    return this.apiRequest<string>(url, options);
  }

  public async updateShipmentStatusToWorking(shipmentId: string) {
    const url = this.constructUrl(`/status-working/${shipmentId}`);
    const options = this.constructOptions("PATCH");
    return this.apiRequest<string>(url, options);
  }

  public async toggleCheckAllPalletProducts(
    shipmentId: number,
    palletId: number
  ) {
    const url = this.constructUrl(`/${shipmentId}/pallets/${palletId}/check`);
    const options = this.constructOptions("PUT");
    return this.apiRequest<string>(url, options);
  }

  public async updateFbaShipmentStatusToReadyToPick(shipmentId: string) {
    const url = this.constructUrl(`/status-ready/${shipmentId}`);
    const options = this.constructOptions("PATCH");
    return this.apiRequest<string>(url, options);
  }
}
