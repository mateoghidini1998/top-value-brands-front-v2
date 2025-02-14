import { GetWarehouseLocationsResponse } from "@/types/warehouse-location.type";
import { BaseService, IApiRequest } from "./base-service";

export class WarehouseLocationService extends BaseService {
  constructor(apiRequest: IApiRequest) {
    super(apiRequest);
  }

  protected getEndpoint(): string {
    return "/pallets";
  }

  public async GetWarehouseLocations(
    available: boolean = true
  ): Promise<GetWarehouseLocationsResponse> {
    const url = this.constructUrl(
      `/warehouse/locations?available=${available}`
    );
    return this.apiRequest<GetWarehouseLocationsResponse>(url);
  }
}
