import {
  GetShipemntByIDResponse,
  GetShipmentsProps,
  GetShipmentsResponse,
} from "@/types/shipments/get.types";
import { BaseService, type IApiRequest } from "./base-service";
import { CreateShipmentProps } from "@/types/shipments/create.types";

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
}
